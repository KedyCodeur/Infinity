const path = require("path");

const bcrypt = require("bcrypt")

const db = require(path.join(__dirname,"..","config","dbConnection.js"));



const getProductByCodeBare = async (req, res) => {

    
    const codeBar = req.body.codeBar;

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }


    const query = `
        SELECT p.lib_prd, p.contenu, p.ref_prd, p.unite_contenu, tp.uprice_wt 
        FROM codebarres as codeB 
        LEFT JOIN produits as p ON codeB.id = p.id 
        LEFT JOIN tarifs_produits as tp ON codeB.id = tp.id 
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

    const codeBar = req.body.codeBar;
    let quantity = req.body.quantity;

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }

    if (!quantity) {
        return res.status(400).json({ err: "quantity can not be empty" });
    }

    quantity =  quantity.toString().replace(/,/g, ".");

    const query = `
    UPDATE produits 
    SET contenu = ? 
    WHERE id = (SELECT id FROM codebarres WHERE cod_barr = ?)
    `;

    try{

        const [result] = await db.execute(query,[quantity,codeBar]);

        if(result.affectedRows === 0){
           return res.status(404).json({ err: "Barcode not found" });
        }
        return res.status(200).json({succes : "Product content updated succesfuly"});

    }catch(e){
        console.log(e)
        return res.status(500).json({ err: "Server Error" });
    }

}

const findProduct =  async (req,res) => {

    const codeBar = req.body.codeBar.trim();
    

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }

    const query = `
      SELECT p.lib_prd , tp.uprice_wt  FROM produits p JOIN codebarres as cb ON p.id = cb.id JOIN tarifs_produits as tp ON p.id = tp.id WHERE cb.cod_barr = ?
    `;

    try{

        const [result] = await db.execute(query,[codeBar]);

        if(result.length === 0){
           return res.status(404).json({ err: "Barcode not found" });
        }
        return res.status(200).json({succes : "Product Found" ,  ...result[0]});

    }catch(e){
        console.log(e)
        return res.status(500).json({ err: "Server Error" });
    }
}

const changeProductPrice =  async (req,res) => {

    const codeBar = req.body.codeBar;
    let price = req.body.price;

    if (!codeBar) {
        return res.status(400).json({ err: "codeBar can not be empty" });
    }

    if (!price) {
        return res.status(400).json({ err: "price can not be empty" });
    }   
    
    price =  price.toString().replace(/,/g, ".");

    if(price < 0) return res.status(500).json({ err: "Server Error" })
    if(price > 15000) return res.status(500).json({ err: "Server Error" })

    const regex = /^\d+(\.\d+)?$/;
    
    if(!regex.test(price)) return res.status(500).json({ err: "Server Error" });
    
    const query = `
    UPDATE tarifs_produits 
    SET uprice_wt = ? 
    WHERE id = (SELECT id FROM codebarres WHERE cod_barr = ?)
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


//lib_prd -> label Name  

//unit contenu KG L 

// contenu 

// ref_prd

// -> produits 


//  uprice_wt -> tarifs_produits 

