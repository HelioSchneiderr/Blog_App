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

router.get('/categories', (req, res) => {
    Categoria.find().lean().then((categories) => {
        res.render('admin/categories', {categories: categories})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias')
        res.redirect('/admin')
    })
})

router.get(`/categories/add`, (req, res) => {
    res.render("admin/addcategories")
})

router.post("/categories/nova", (req, res) =>{

    let erros = [];
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Invalido"})
    };

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug Invalido"})
    };

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da Categoria muito pequeno"})
    }
    
    if(erros.length > 0){
        res.render("admin/addcategories", {erros: erros })
    }else{
        const newCategorie = {
            nome: req.body.nome,
            slug: req.body.slug
        };
    
        new Categoria(newCategorie).save().then(() => {
            req.flash("success_msg", "Categoria Registrada com sucesso")
            res.redirect("/admin/categories")
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro ao salvar a mensagem")
            res.redirect("/admin")
        })

    }
    

    
});

module.exports = router;