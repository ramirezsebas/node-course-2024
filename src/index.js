require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");

const { isUserValid } = require("./middlewares/isAuth");
const { isAdmin } = require("./middlewares/isAdmin");
const morgan = require("morgan");

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.post("/register", async (req, res) => {
  const { usuario, contra, role } = req.body;

  if (!usuario) {
    return res.status(400).json({
      mensaje: "Debes ingresar usuario y contraseña",
    });
  }

  if (!contra) {
    return res.status(400).json({
      mensaje: "Debes ingresar usuario y contraseña",
    });
  }

  if (role) {
    if (role.toUpperCase() !== "ADMIN" && role.toUpperCase() !== "USER") {
      return res.status(400).json({
        mensaje: "Role invalido: Solo se permite ADMIN o USER",
      });
    }
  }

  try {
    const hash = await bcrypt.hash(contra, 10);

    // Leemos nuestra base de datos

    //Verificamos si el archivo existe
    if (!fs.existsSync("usuarios.json")) {
      fs.writeFileSync("usuarios.json", "[]");
    }

    fs.readFile("usuarios.json", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          mensaje: "Por favor contacta con soporte",
        });
      }

      // Convertimos el string a un objeto
      const usuarios = JSON.parse(data);

      // Verificamos si el usuario ya existe
      const usuarioEncontrado = usuarios.filter(
        (usu) => usu.usuario == usuario
      );

      if (usuarioEncontrado.length > 0) {
        return res.status(400).json({
          mensaje: "Usuario ya existe",
        });
      }

      // Agregamos el nuevo usuario
      usuarios.push({
        usuario,
        contra: hash,
        role: role || "USER",
      });

      // Guardamos el nuevo usuario
      fs.writeFile("usuarios.json", JSON.stringify(usuarios), (err) => {
        if (err) {
          return res.status(500).json({
            mensaje: "Por favor contacta con soporte",
          });
        }
        return res.status(201).json({
          mensaje: "Usuario creado correctamente",
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Por favor contacta con soporte",
    });
  }
});

app.post("/login", (req, res) => {
  const { usuario, contra } = req.body;

  if (!usuario) {
    return res.status(400).json({
      mensaje: "Usuario o contraseña invalido",
    });
  }

  if (!contra) {
    return res.status(400).json({
      mensaje: "Usuario o contraseña invalido",
    });
  }

  // Leemos nuestra base de datos
  if (!fs.existsSync("usuarios.json")) {
    return res.status(400).json({
      mensaje: "Usuario o contraseña invalido",
    });
  }

  const usuarios = JSON.parse(fs.readFileSync("usuarios.json", "utf-8"));

  // VERIFICA SU EL USUARIO EXISTE
  const usuarioEncontrado = usuarios.filter((usu) => usu.usuario == usuario);

  if (usuarioEncontrado.length == 0) {
    return res.status(400).json({
      mensaje: "Usuario o contraseña invalido",
    });
  }

  // VERIFICAR CONTRASEÑA
  const contraValida = bcrypt.compareSync(contra, usuarioEncontrado[0].contra);

  if (!contraValida) {
    return res.status(400).json({
      mensaje: "Usuario o contraseña invalido",
    });
  }

  const usu = usuarioEncontrado[0];

  const token = jwt.sign(
    {
      usuario,
      role: usu.role,
    },
    process.env.JSON_WEB_TOKEN_SECRET,
    {
      expiresIn: "1m",
    }
  );

  return res.status(200).json({ token });
});

app.get("/productos", isUserValid, isAdmin, (req, res) => {
  if (!fs.existsSync("productos.json")) {
    return res.status(200).json([]);
  }

  const productos = JSON.parse(fs.readFileSync("productos.json", "utf-8"));

  return res.status(200).json(productos);
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    mensaje: "Servidor corriendo correctamente",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Autenticacion -> No se quien es? -> 401
// Autorizacion -> Se quien es, pero no tiene permiso? -> 403
