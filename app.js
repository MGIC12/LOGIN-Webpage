// Invoco Express
const express = require("express");
const app = express();

// Seteo urlencoded para capturar datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Invoco dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

// El directorio public
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

// Motor de plantillas ejs
app.set("view engine", "ejs");

// Invoco bcrypt
const bcryptjs = require("bcryptjs");

// Var. de session
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Invoco connection
const connection = require("./database/db");

// Rutas
app.get("/", (req, res) => {
  res.render("index", { msg: "Boludin" });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// Registración
app.post("/register", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  let passwordHash = await bcryptjs.hash(pass, 8);
  connection.query(
    "INSERT INTO users SET ?",
    {
      user: user,
      name: name,
      rol: rol,
      pass: passwordHash,
    },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render("register", {
          alert: true,
          alertTitle: "Registration",
          alertMessage: "Registration successfull",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "",
        });
      }
    }
  );
});

// Autenticación
app.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE user = ?",
      [user],
      async (error, results) => {
        if (
          results.length == 0 ||
          !(await bcryptjs.compare(pass, results[0].pass))
        ) {
          res.send("El usuario o la contraseña son incorrectos");
        } else {
          res.send("Login correcto");
        }
      }
    );
  }
});

app.listen(3000, (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3000");
});
