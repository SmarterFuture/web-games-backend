require("dotenv").config({
    path: "./.env"
});
const express = require("express");
const pool = require("./db.config.js");

const app = express();

const PORT = process.env.PORT || 9000;

//Functions
const getUsers =  (_, res) => {
  pool.query('SELECT * FROM users', (error, products) => {
    if (error) {
      throw error
    }
    res.status(200).json(products.rows)
  })
}

//Here you can add your routes
//Here's an example
app.get("/", (_, res) => {
    res.send("Hello World!");
  });

app.get('/users', getUsers)


app.listen(PORT, () => {
    console.log(`Server listening on the port  ${PORT}`);
})
