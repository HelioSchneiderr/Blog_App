//loading modules
    const express = require(`express`);
    const handlebars = require(`express-handlebars`)
    const bodyParser = require("body-parser")
    const app = express();
    const admin = require("./routes/admin.js")
    const path = require("path")
    const mongoose = require("mongoose")
 

//Configuration
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
        app.use(express.static(path.join(__dirname, "public")))


//Routes
    app.use("/admin", admin)

    //Others

const PORT = 8090
app.listen(PORT, () => {
    console.log("Server is open")
})