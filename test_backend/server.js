require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const crypto = require('crypto')
const path = require("path");

const XLSX = require('xlsx');

const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "public/");
  },
  filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); 
      cb(null, file.fieldname + "-" + Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(cors())
app.use("/public", express.static(path.join(__dirname, "public")));

const db = mysql.createPool({
  host:  "localhost",
  user:  "root",
  password:  "root",
  database:  "test",
});

// login user
app.post('/login',async (req,res)=>{
  let {email,password}=req.body;

  if(!email || !password) return res.json({code:401,msg:'Provide email and password'});
  

  let [user,fields] = await db.query(`select * from users where email='${email}'`);
  console.log(user);
  if(!user || !user.length) return res.json({code:404, msg:'email not found'});
  let pswd = crypto.createHash('md5').update(password).digest("hex");
  if(user[0].password == pswd){
    res.json({code:200,msg:'Logged in successfull',data:user[0]});
  }else{
    res.json({code:401,msg:'Password Not matched'});
  }
})

app.get('/products',async (req,res)=>{
  try {
    let { page = 1, limit = 10, sort = "price", order = "asc", search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    
    const offset = (page - 1) * limit;
    const query = `
        select p.id, p.name, p.price, p.id, c.name as category, p.image_url
        from products p
        join categorymaster c ON p.category_id = c.id
        where p.name like ? OR c.name like ?
        order by ${sort} ${order}
        limit ? offset ?`;
    console.log(query);
    const [rows] = await db.query(query, [`%${search}%`, `%${search}%`, limit, offset]);
    console.log(rows);
    if(rows.length == 0){
      res.json({code:404,msg:'Products Not Found'});
    }else{
      res.json({code:200,msg:'success',data:rows});
    }
  } catch (error) {
        res.json({code:500,msg:error});
  }
});



app.post("/products/bulk-upload", upload.single("file"), async (req, res) => {
    try {
          const filePath = req.file.path;
          const workbook = XLSX.readFile(filePath);  
          const sheetName = workbook.SheetNames[0];
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          console.log(jsonData);
          const insertQuery = `insert into products (name, price, category_id,image_url) VALUES ?`;

          // Split into chunks of 20
          for (let i = 0; i < jsonData.length; i += 20) {
            const chunk = jsonData.slice(i, i + 20);
            const values = chunk.map(row => [row.name, row.price, row.category_id,row.image_url]);
      
            // Execute bulk insert query
            await db.query(insertQuery, [values]);
          }
      
          console.log("Data inserted successfully");
          res.json({ code: 201, message: "Products uploaded successfully" });
    } catch (error) {
      console.log(error)
        res.json({ code: 500, message: "Upload failed" });
    }
});

app.get("/products/report", async (req, res) => {
  try {
      const [rows] = await db.query(`
          select c.name as category_name, p.name as product_name, p.price, p.id
          from products p
          join categories c ON p.category_id = c.id
      `);

      res.setHeader("Content-Disposition", "attachment; filename=products.csv");
      res.setHeader("Content-Type", "text/csv");

      fastCsv.write(rows, { headers: true }).pipe(res);
  } catch (error) {
      res.json({ code: 500, message: "Download failed" });
  }
});

app.post('/product',upload.single("image"),async (req,res)=>{
  let {name,price,category_id} = req.body;
  let image = req.file.filename;
  const imageUrl = `${req.protocol}://${req.get("host")}/public/${image}`;
  const query = `insert into products (name, price, category_id,image_url) VALUES (?,?,?,?)`;
  await db.query(query, [name,price,category_id,imageUrl]);
  res.json({ code: 201, message: "Products uploaded successfully" });
});


app.post('/category',async (req,res)=>{
  let {name} = req.body;
  const query = `insert into categorymaster (name) VALUES (?)`;
  let op = await db.query(query, [name]);
  res.json({ code: 201, message: "category uploaded successfully",data:op });
});


app.get('/categories',async (req,res)=>{
  
  const query = `select * from categorymaster`;
  let op = await db.query(query);
  res.json({ code: 201, message: "get category successfull",data:op[0] });
});


app.listen(3000, () => console.log("Server running on port 3000"));