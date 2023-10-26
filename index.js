
const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;

// CONEXIÓN CON MONGODB VÍA MONGO CLIENT

MongoClient.connect("mongodb://0.0.0.0:27017/", function (err, client) {
  if (err != null) {
    console.log(err);
    console.log("No se ha podido conectar con MongoDB");
  } else {
    app.locals.db = client.db("baseMascotas");
    console.log("Conexión correcta a la base de datos mascotas de MongoDB");
  }
});

// RUTAS GET Y POST ENCAPSULADAS

app.get("/api/mascotas", mostrarMascotas);
app.post("/api/nuevaMascota", añadirMascota);
app.get("/api/mascotas/:contenido", buscarMascota);

// CONTROLADOR - VER TODAS LAS MASCOTAS
function mostrarMascotas(req, res) {
  app.locals.db
    .collection("mascotas")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
}

// CONTROLADOR - AÑADIR MASCOTA ok
function añadirMascota(req, res) {
  const mascota = {
    animal: req.body.animal,
    raza: req.body.raza,
    vida: req.body.vida,
    descripcion: req.body.descripcion,
  };
  app.locals.db.collection("mascotas").insertOne(mascota, function (err, res) {
    if (err) throw err;
    console.log("1 documento insertado");
  });
  res.redirect("/api/mascotas");
}

// CONTROLADOR - BUSCAR MASCOTAS POR TITULO ok

function buscarMascota(req, res) {
  // const titulo = req.params.titulo;
  const contenido = req.params.contenido;
  console.log(contenido);
  app.locals.db
    .collection("mascotas")
    .find({
      $or: [
        { animal: { $regex: contenido, $options: "i" } },
        { descripcion: { $regex: contenido, $options: "i" } },
      ],
    })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
}

//PETICIONES NO ENCAPSULADAS DE TIPO PUT Y DELETE

app.put("/api/modificarAnimal", function (req, res) {
  let modificacion = req.body;
  app.locals.db
    .collection("mascotas")
    .updateOne(
      { animal: req.body.animal },
      { $set: modificacion },
      function (err, datos) {
        if (err != null) {
          console.log(err);
          res.send({ mensaje: "error: " + err });
        } else {
          console.log(datos);
          res.send(datos);
        }
      }
    );
});

// Petición DELETE es para borrar *
app.delete("/api/borrarAnimal", (req, res) => {
  console.log("entro en el server");
  app.locals.db
    .collection("mascotas")
    .deleteMany({ animal: req.body.animal }, function (err, datos) {
      if (err != null) {
        console.log(err);
        res.send({ mensaje: "error: " + err });
      } else {
        console.log(datos);
        res.send(datos);
      }
    });
});

// PUERTO

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});
