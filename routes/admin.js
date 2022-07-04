const express = require(`express`)
const app = express();
const router = express.Router()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
require("../models/Categorie")
const Categoria = mongoose.model("categories")

        app.use(express.urlencoded({extended: true}));
        app.use(express.json());

router.get(`/`, (req, res) => {
    res.render("admin/index")
});

router.get("/posts", (req, res) =>{
    res.send("Page for posts")
})

router.get("/categories", (req, res)=>{
    res.render(`admin/categories`)
});

router.get(`/categories/add`, (req, res) => {
    res.render("admin/addcategories")
})

router.post("/categories/nova", (req, res) =>{

    const newCategorie = {
        nome: req.body.nome,
        slug: req.body.slug
    };

    new Categoria(newCategorie).save().then(() => {
        console.log("Categoria salva com sucesso!")
    }).catch((err) =>{
        console.log("Erro ao salvar" + err)
    })
});

module.exports = router;