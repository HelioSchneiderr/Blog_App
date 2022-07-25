//loading modules
    const express = require(`express`);
    const handlebars = require(`express-handlebars`)
    const bodyParser = require("body-parser")
    const app = express();
    const admin = require("./routes/admin.js")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    require("./models/Postagens")
    const Postagem = mongoose.model("postagens")
    require("./models/Categorie")
    const Categorie = mongoose.model("categories")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)

//Configuration

    //session
        app.use(session({
            secret: "categories",
            resave: true,
            saveUninitialized: true
        }));

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    // Middleware
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            next();
        })    

    //Body Parser
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
    
    //Handlebars
        var handle = handlebars.create({
        defaultLayout: 'main'
        });
    
        app.engine('handlebars', handle.engine);
        app.set('view engine', 'handlebars');

        

    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(() =>{
            console.log("Conectado ao mongo")
        }).catch((err) => {
            console.log("Erro ao se conectar: " +err)
        })

    //Public
        app.use(express.static(path.join(__dirname, "public")));

        app.use((req, res, next) => {
            next();
        })


//Routes

app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({data: 'desc'}).then((postagens) => {
        res.render("index", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Não foi possível carregar os posts")
        res.redirect("/404")
    })
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagens)=>{
        if(postagens){
            res.render("postagens/index", {postagens:postagens})
        
        }else{
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")
        }
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

    app.get("/categorias", (req, res) =>{
        Categorie.find().lean().then((categories)=>{
            res.render("categorias/index", {categories: categories})
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req, res)=>{
        Categorie.findOne({slug: req.params.slug}).lean().then((categories)=>{
            if(categories){
                Postagem.find({categoria: categories._id}).lean().then((postagens) =>{
                    res.render("categorias/postagem", {postagens: postagens, categories: categories})
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts")
                    res.redirect("/")
                })
            }else{
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/")
            }
        }).catch((err) =>{
            req.flash("error_msg", "Está categoria não existe")
            res.redirect("/")
        })
    })

    app.use("/admin", admin)
    app.use("/usuarios", usuarios)

    //Others

const PORT = 8090
app.listen(PORT, () => {
    console.log("Server is open")
})