// módulo necesario para accerder a variables de entorno
require('dotenv').config()

const express = require('express')
const app = express()
const puerto = process.env.PORT || 3000;

app.use(express.json()); // permite aceptar jsones en body
app.use(express.urlencoded({extended: true}));

const { MongoClient, ServerApiVersion } = require("mongodb");
const mongo = require("mongodb"); // necesario para generar correctamente ObjectId

const uriLocal = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const uri = uriLocal;
//const uri = 'mongodb+srv://root:root@cluster0.m6rrr28.mongodb.net/';


// https://www.mongodb.com/docs/drivers/node/current/connect/mongoclient/
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // Envía ping para confirmar conexión satisfactoria
    await client.db("admin").command({ ping: 1 });
    console.log("Conectado a MongoDB...\n");

  } finally {
    await client.close();
  }
}

run().catch(console.dir);

app.listen(puerto, () => {
  console.log(`\nAPI-REST escuchando en puerto ${puerto}...`);
});



// APIS
app.post('/usuarios', async (req, res) => {
  realizarConsultaBD(req, res, "CREAR", "usuarios");
});

app.post('/grupos', async (req, res) => {
  realizarConsultaBD(req, res, "CREAR", "grupos");
});

app.get('/usuarios', async (req, res) => {
  realizarConsultaBD(req, res, "LEER", "usuarios");
});

app.get('/usuarios/:id', async (req, res) => {
  realizarConsultaBD(req, res, "LEER", "usuarios");
});

app.get('/grupos', async (req, res) => {
  realizarConsultaBD(req, res, "LEER", "grupos");
});

app.get('/grupos/:id', async (req, res) => {
  realizarConsultaBD(req, res, "LEER", "grupos");
});

app.put('/usuarios/:id', async (req, res) => {
  realizarConsultaBD(req, res, "ACTUALIZAR", "usuarios");
});

app.put('/grupos/:id', async (req, res) => {
  realizarConsultaBD(req, res, "ACTUALIZAR", "grupos");
});

app.delete('/usuarios/:id', async (req, res) => {
  realizarConsultaBD(req, res, "BORRAR", "usuarios");
});

app.delete('/grupos/:id', async (req, res) => {
  realizarConsultaBD(req, res, "BORRAR", "grupos");
});

// VIDEOTUTO
// https://www.youtube.com/watch?v=D332DCt4Y5Y&t=961s
// https://github.com/manufosela/introduccion-docker

//CONSULTAS
async function realizarConsultaBD(req, res, tipoConsulta, coleccionBD) {
  try {
    let result, id, body;

    const conexion = await client.connect();
    const baseDatos = conexion.db('centro');
    const coleccion = baseDatos.collection(coleccionBD);
    
    switch (tipoConsulta) {
        
      case "CREAR":
        body = req.body;

        result = await coleccion.insertOne(body);
        res.status(200).json({ message: "Registro CREADO CORRECTAMENTE - id: " + result.insertedId });

        break;

      case "LEER":
        id = req.params;

        if (JSON.stringify(id) === "{}") {
          result = await coleccion.find().toArray();
        } else {
          //result = await coleccion.find({_id: new mongo.ObjectId(id)}).toArray();
          result = await coleccion.findOne({_id: new mongo.ObjectId(id)});
        }

        res.send(result);

        break;

      case "ACTUALIZAR":
        id = req.params.id;
        body = req.body;

        result = await coleccion.updateOne({ _id: new mongo.ObjectId(id) }, {$set:body});
        res.status(200).json({ message: "Registro ACTUALIZADO CORRECTAMENTE" });

        break;

      case "BORRAR":
        id = req.params.id;

        result = await coleccion.deleteOne({ _id: new mongo.ObjectId(id) });
        res.status(200).json({ message: "Registro BORRADO CORRECTAMENTE" });

        break;
    }

  } catch (err) {
    res.status(400).json({ message: "ERROR - No se encontraron documentos que coincidan con la consulta" });
    console.log(err);
    
  } finally {
    await client.close();
  }
}