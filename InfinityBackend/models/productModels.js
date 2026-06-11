const path = require("path");



const db = require('../config/dbConnection.js');



const getProductByCodeBare = async (req, res) => {

    
    const codeBar = req.body.codeBar?.trim();

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }


    const query = `
        SELECT tp.dat_deb, tp.dat_fin, tp.dat_upd ,p.lib_prd, p.contenu, p.ref_prd, p.unite_contenu, tp.uprice_wt 
        FROM codebarres as codeB 
        LEFT JOIN produits as p ON codeB.id_prd = p.id
        LEFT JOIN tarifs_produits as tp ON codeB.id_prd = tp.id_prd
        WHERE codeB.cod_barr = ? 
    `;

    
    try {
 
        const [rows] = await db.execute(query, [codeBar]);


        if (!rows || rows.length === 0) {
            return res.status(404).json({ err: "Barcode not found" });
        }

        const promotionList = rows.filter(p => {
            if (p.dat_deb === "" || p.dat_deb == null) return false;
            if (p.dat_fin === "" || p.dat_fin == null) return false;
            const deb = new Date(p.dat_deb.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            const fin = new Date(p.dat_fin.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
            const now = Date.now();
            if (deb <= now && fin >= now) return true;

            return false;
        });

        let tarif 

        if(promotionList.length > 0) {
            tarif = promotionList.reduce((latest, p) => {
            return new Date(p.dat_upd) > new Date(latest.dat_upd) ? p : latest;
        });
        }else {
            const defaultList = rows.filter(p => 
                (p.dat_deb === "" || p.dat_deb == null) && (p.dat_fin === "" || p.dat_fin == null)
            );
            tarif = defaultList[0] ?? null;
        }


        if(!tarif){
            tarif="empty" 
        }

        return res.json(tarif);

    } catch (e) {
        console.error(e)
        return res.status(500).json({ err: "Server Error" });
        
    }
};

const changeProductQuantity = async (req,res) => {

    const codeBar = req.body.codeBar?.trim();
    let quantity = req.body.quantity;

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }

    if (quantity == null || quantity === "") {
        return res.status(400).json({ err: "quantity can not be empty" });
    }

    quantity =  quantity.toString().replace(/,/g, ".");

    const query = `
    UPDATE produits 
    SET contenu = ? 
    WHERE id = (SELECT id_prd FROM codebarres WHERE cod_barr = ?)
    `;

    try{

        const [result] = await db.execute(query,[quantity,codeBar]);

        if(result.affectedRows === 0){
           return res.status(404).json({ err: "Barcode not found" });
        }
        return res.status(200).json({succes : "Product content updated succesfuly"});

    }catch(e){
        
        return res.status(500).json({ err: "Server Error" });
        console.error(e)
    }

}

const findProduct =  async (req,res) => {

   const codeBar = req.body.codeBar?.trim();
    

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }

    const query = `
        SELECT p.lib_prd, tp.uprice_wt 
        FROM codebarres cb
        LEFT JOIN produits p ON cb.id_prd = p.id
        LEFT JOIN tarifs_produits tp ON cb.id_prd = tp.id_prd
        WHERE cb.cod_barr = ?
        LIMIT 1
    `;

    try{
        
        const [result] = await db.execute(query,[codeBar]);

        if (!result || result.length === 0) {
            return res.status(404).json({ err: "Barcode not found" });
        }

        if (result[0].uprice_wt == null || result[0].lib_prd == null) {
            return res.status(422).json({ err: "Price not found" });
        }

        return res.status(200).json({success: "Product Found" ,  ...result[0]});

    }catch(e){
        
        return res.status(500).json({ err: "Server Error" });
        console.error(e)
    }
}

const changeProductPrice =  async (req,res) => {

    const codeBar = req.body.codeBar?.trim();
    let price = req.body.price;

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }

    if (price == null || price === "") {
        return res.status(400).json({ err: "price can not be empty" });
    }   
    

    price =  price.toString().replace(/,/g, ".");

    const numPrice = Number(price);

    if (isNaN(numPrice) || numPrice < 0 || numPrice > 15000) return res.status(400).json({ err: "Bad Request" })
    

    const regex = /^\d+(\.\d+)?$/;
    
    if(!regex.test(price)) return res.status(400).json({ err: "Bad Request" });
    

    const getTax = ` 
    Select tc.class_lab FROM codebarres AS cb
    JOIN produits AS p ON cb.id_prd = p.id
    JOIN tax_classes AS tc ON p.id_taxclass = tc.id
    WHERE cb.cod_barr = ?
    `
    let taxRate
    try{
        
    const [taxRateRaw] = await db.execute(getTax, [codeBar]);
    taxRate = parseFloat(taxRateRaw[0].class_lab);

    }catch(e){
        console.log(e)
        return res.status(404).json({err : "Invalid Data"})

    }


    const priceWithoutTax = (numPrice / (1 + taxRate / 100)).toFixed(2);


    const query = `
        UPDATE tarifs_produits tp
        JOIN codebarres cb ON cb.id_prd = tp.id_prd
        SET tp.uprice_wt = ? , tp.prix_u_ht = ?
        WHERE cb.cod_barr = ? AND (dat_deb = '' OR tp.dat_deb IS NULL) AND (dat_fin = '' OR tp.dat_fin IS NULL)
    `; // default price 

    const dateUpdateTarif = `
    UPDATE tarifs_produits
    JOIN codebarres cb ON cb.id_prd = tarifs_produits.id_prd
    SET tarifs_produits.dat_upd = NOW()
    `;

    const dateUpdateProd = `
        UPDATE produits
        JOIN codebarres cb ON cb.id_prd = produits.id
        SET produits.dat_upd = NOW() 
        WHERE cb.cod_barr = ?
    `;

    const conn = await db.getConnection();
    try {
        
        await conn.beginTransaction();
        const [result]  = await conn.execute(query,[price,priceWithoutTax,codeBar]);
        const [result2] = await conn.execute(dateUpdateTarif, [codeBar]);
        const [result3] = await conn.execute(dateUpdateProd, [codeBar]);

        if (result.affectedRows === 0 || result2.affectedRows === 0 || result3.affectedRows === 0 ) {
            await conn.rollback();
            return res.status(404).json({ err: "Barcode not found" });
        }

        await conn.commit();
        return res.status(200).json({ success: "Product price updated successfully" });

    } catch (e) {
        await conn.rollback(); 
        console.error(e);
        return res.status(500).json({ err: "Server Error" });
    }finally {
    conn.release();
    }
}

module.exports = {getProductByCodeBare,changeProductQuantity,changeProductPrice,findProduct}


