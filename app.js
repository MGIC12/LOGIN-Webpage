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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3000");
});
