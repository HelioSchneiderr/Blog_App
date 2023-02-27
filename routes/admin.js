const express = require(`express`)
const app = express();
const router = express.Router()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
require("../models/Categorie")
const Categoria = mongoose.model("categories")
require(`../models/Postagens`)
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get(`/`,eAdmin, (req, res) => {
    res.render("admin/index")
});

router.get("/posts", (req, res) => {
    res.send("Page for posts")
})

router.get('/categories', (req, res) => {
    Categoria.find().sort({ date: "desc" }).lean().then((categories) => {
        res.render('admin/categories', { categories: categories })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias')
        res.redirect('/admin')
    })
})

router.get(`/categories/add`, eAdmin, (req, res) => {
    res.render("admin/addcategories")
})

router.post("/categories/nova",eAdmin, (req, res) => {

    let erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome Invalido" })
    };

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug Invalido" })
    };

    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome da Categoria muito pequeno" })
    }

    if (erros.length > 0) {
        res.render("admin/addcategories", { erros: erros })
    } else {
        const newCategorie = {
            nome: req.body.nome,
            slug: req.body.slug
        };

        new Categoria(newCategorie).save().then(() => {
            req.flash("success_msg", "Categoria Registrada com sucesso")
            res.redirect("/admin/categories")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a mensagem")
            res.redirect("/admin")
        })

    }
});

router.get("/categories/edit/:id",eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categories) => {
        res.render("admin/editcategories", { categories: categories })
    }).catch((err) => {
        req.flash("error_msg", "Esta Categoria não existe")
        res.redirect("/admin/categories")
    })
})

router.post("/categories/edit",eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categories) => {
        categories.nome = req.body.nome
        categories.slug = req.body.slug

        categories.save().then(() => {
            req.flash("success_msg", "Categoria Editada")
            res.redirect("/admin/categories")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro em salvar a categoria")
            res.redirect("/admin/categories")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.post("/categories/deletar",eAdmin, (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categories")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro")
        res.redirect("/admin/categories")
    })
})

router.get("/postagens", (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens   " + err)
        res.redirect("/admin")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {

    Categoria.find().lean().then((categories) => {
        res.render("admin/addpostagens", { categories: categories })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })

})

router.post("/postagens/nova",eAdmin, (req, res) => {

    let erros = []

    if (req.body.categories == "0") {
        erros.push({ text: "Categoria inválida, registre uma categoria" })
    }

    if (erros.length > 0) {
        res.render("admin/addpostagens", { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salva a postagem" + err);
            res.redirect("/admin/postagens")
        })
    }
})

router.get("/postagens/edit/:id",eAdmin, (req, res) => {

    Postagem.findOne({ _id: req.params.id }).lean().then((postagens) => {


        Categoria.find().lean().then((categories) => {
            res.render("admin/editpostagens", { categories: categories, postagens: postagens })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin/postagens")
    })

})

router.get("/postagens/deletar/:id",eAdmin, (req, res)=>{
    Postagem.remove({_id: req.params.id}).lean().then(()=>{
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/admin/postagens")
    }) 
})

module.exports = router;