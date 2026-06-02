const path = require("path");

const bcrypt = require("bcrypt")

const db = require(path.join(__dirname,"..","config","dbConnection.js"));



const getProductByCodeBare = async (req, res) => {

    
    const codeBar = req.body.codeBar?.trim();

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }


    const query = `
        SELECT p.lib_prd, p.contenu, p.ref_prd, p.unite_contenu, tp.uprice_wt 
        FROM codebarres as codeB 
        LEFT JOIN produits as p ON codeB.id_prd = p.id
        LEFT JOIN tarifs_produits as tp ON codeB.id_prd = tp.id_prd
        WHERE codeB.cod_barr = ? 
        LIMIT 1
    `;

    try {
 
        const [rows] = await db.execute(query, [codeBar]);


        if (!rows || rows.length === 0) {
            return res.status(404).json({ err: "Barcode not found" });
        }

        return res.json(rows[0]);

    } catch (e) {
        return res.status(500).json({ err: "Server Error" });
        console.log(e)
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
        console.log(e)
    }

}

const findProduct =  async (req,res) => {

   const codeBar = req.body.codeBar?.trim();
    

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }

    const query = `
      SELECT p.lib_prd , tp.uprice_wt  FROM produits p JOIN codebarres as cb ON p.id = cb.id_prd JOIN tarifs_produits as tp ON p.id = tp.id_prd WHERE cb.cod_barr = ?
    `;

    try{

        const [result] = await db.execute(query,[codeBar]);

        if(result.length === 0){
           return res.status(404).json({ err: "Barcode not found" });
        }
        return res.status(200).json({success: "Product Found" ,  ...result[0]});

    }catch(e){
        
        return res.status(500).json({ err: "Server Error" });
        console.log(e)
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
    
    const query = `
        UPDATE tarifs_produits tp
        JOIN codebarres cb ON cb.id_prd = tp.id_prd
        SET tp.uprice_wt = ?
        WHERE cb.cod_barr = ?
    `;

    try{

        const [result] = await db.execute(query,[price,codeBar]);

        if(result.affectedRows === 0){
           return res.status(404).json({ err: "Barcode not found" });
        }
        return res.status(200).json({succes : "Product price updated succesfuly"});

    }catch(e){
        console.log(e)
        return res.status(500).json({ err: "Server Error" });
    }
}

module.exports = {getProductByCodeBare,changeProductQuantity,changeProductPrice,findProduct}


