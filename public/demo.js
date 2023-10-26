recibirMascotas();

function recibirMascotas() {
  fetch("api/mascotas")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let series = "";
      for (let i = 0; i < data.length; i++) {
        series += `
                <div id="card">
                    <h3>${data[i].animal}</h3>
                    <p>Raza: ${data[i].raza}</p>
                    <p>Vida: ${data[i].vida}</p>
                    <p>Descripción: ${data[i].descripcion}</p>
                </div>
            `;
      }
      // USO DEL DOM. ¿QUÉ HAGO AQUÍ? IMPRIMO DESDE EL JS AL HTML
      document.getElementById("div1").innerHTML = series;
    });
}

function buscar() {
  
  let contenido = document.getElementById("mascotaBuscar").value;
  console.log(contenido);
  fetch("/api/mascotas/" + contenido)
    .then(function (res) {
      return res.json();
    })
    .then(function (datos) {
      let print = "";
      for (let i = 0; i < datos.length; i++) {
        print += `<div id="card">
        <h4>${datos[i].animal}</h4>
        <p>Raza: ${datos[i].raza}</p>
        <p>Esperanza de vida: ${datos[i].vida}</p> 
        <p>Descripción: ${datos[i].descripcion}</p>
      </div>`;
      }

      document.getElementById("div1").innerHTML = print;
    });
}

function insertar() {
  const animal = document.getElementById("animal").value;
  const raza = document.getElementById("raza").value;
  const vida = parseInt(document.getElementById("vida").value);
  const descripcion = document.getElementById("descripcion").value;

  const mascotaInsertar = {
    animal,
    raza,
    vida,
    descripcion,
  };

  fetch("/api/nuevaMascota/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mascotaInsertar),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (datos) {
      console.log(datos);
      recibirMascotas();
    });
}

// EDITAR // ok
function editar() {
  // PRIMERO, GRABO INFORMACIÓN QUE EL USUARIO ME HA DADO 
 let animal = document.getElementById("animalEditar").value;
 let raza = document.getElementById("razaEditar").value;
 let vida = document.getElementById("vidaEditar").value;
 let descripcion = document.getElementById("descripcionEditar").value;

 // ENCAPSULO ESTA INFORMACIÓN EN UN OBJETO LITERAL *
 let nuevo = {}
  nuevo.animal=animal;
  if (animal!=""){
    nuevo.animal=animal
  }
  if (raza!=""){
    nuevo.raza=raza
  }
  if (vida!=""){
    nuevo.vida=vida
  }
  if (descripcion!=""){
    nuevo.descripcion=descripcion;
  }

 // VAMOS A MANDAR ESTA INFORMACIÓN AL SERVIDOR. NOSOTROS *
     // ESTAMOS EN EL LADO DEL CLIENTE (FICHEROS ESTÁTICOS) Y
     // TENGO QUE MANDARLA AL SERVIDOR. ES DECIR, TENGO QUE
     // REALIZAR UNA PETICIÓN (UN REQUEST) Y EL SERVIDOR
     // ME TENDRÁ QUE DAR UNA RESPUESTA (RESPONSE)
   
     fetch("/api/modificarAnimal/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevo), //mandas por body el objeto nuevo y no la clave especie
      });
      location.reload()
      
    }
     //BORRAR ** 
 
   //delete
  function borrar(){
    console.log("entro en la funcion borrar");
    let animal=document.getElementById("borrarAnimal").value
    let nuevo = {
      animal: animal,
    }
    fetch(`/api/borrarAnimal`,{
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevo)
    })
    location.reload();
}


