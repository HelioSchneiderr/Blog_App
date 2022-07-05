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
 

//Configuration

    //session
        app.use(session({
            secret: "categories",
            resave: true,
            saveUninitialized: true
        }));

        app.use(flash())

    // Middleware
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
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
            console.log("Oi eu sou um middleware");
            next();
        })


//Routes
    app.use("/admin", admin)

    //Others

const PORT = 8090
app.listen(PORT, () => {
    console.log("Server is open")
})