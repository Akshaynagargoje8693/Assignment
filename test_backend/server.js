require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors())

const db = mysql.createConnection({
  host:  "localhost",
  user:  "root",
  password:  "root",
  database:  "test",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});



app.get("/users", (req, res) => {
  db.query("SELECT users.*, group_concat(company.name) as companies FROM users left join user_company_mapping as map on map.user_id =users.id left join company on company.id = map.company_id group by users.id;", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/companies", (req, res) => {
    db.query("SELECT * FROM company", (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });

app.post("/add/user", (req, res) => {
  const { name, email ,phone,companies} = req.body;

   db.query("INSERT INTO users (name, email,phone) VALUES (?, ?,?)", [name, email,phone], (err, result) => {
    console.log("result",result);
    if (err) throw err;
   
    const values = companies.map(companyId => `(${result.insertId}, ${companyId})`).join(", ");
    db.query(`INSERT INTO user_company_mapping (user_id,company_id) VALUES ${values}`,(err, result1) => {
        if (err) throw err;
        console.log("result1",result1)
        res.json({ message: "User added", data: result });
    })
  });
});


app.listen(3000, () => console.log("Server running on port 3000"));