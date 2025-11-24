const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const app = express();
const port = 3000;

// EJS templating
app.set('view engine', 'ejs');

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// MariaDB pool
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',       // sizning username
  password: '',       // sizning password
  database: 'ombor'
});

// Barcha tavarlar
app.get('/', async (req, res) => {
  const conn = await pool.getConnection();
  const tavars = await conn.query("SELECT * FROM tavars");
  res.render('index', { tavars });
  conn.release();
});

// Qo'shish
app.post('/add', async (req, res) => {
  const { kod, nomi, rangi, soni, qator, stellaj } = req.body;
  const conn = await pool.getConnection();
  await conn.query("INSERT INTO tavars (kod, nomi, rangi, soni, qator, stellaj) VALUES (?, ?, ?, ?, ?, ?)", 
                    [kod, nomi, rangi, soni, qator, stellaj]);
  conn.release();
  res.redirect('/');
});

// O'chirish
app.get('/delete/:id', async (req, res) => {
  const id = req.params.id;
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM tavars WHERE id=?", [id]);
  conn.release();
  res.redirect('/');
});

// Tahrirlash sahifasi
app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const conn = await pool.getConnection();
  const tavar = (await conn.query("SELECT * FROM tavars WHERE id=?", [id]))[0];
  conn.release();
  res.render('edit', { tavar });
});

// Yangilash
app.post('/update/:id', async (req, res) => {
  const id = req.params.id;
  const { kod, nomi, rangi, soni, qator, stellaj } = req.body;
  const conn = await pool.getConnection();
  await conn.query("UPDATE tavars SET kod=?, nomi=?, rangi=?, soni=?, qator=?, stellaj=? WHERE id=?", 
                    [kod, nomi, rangi, soni, qator, stellaj, id]);
  conn.release();
  res.redirect('/');
});

app.listen(port, () => console.log(`Server ishlayapti: http://localhost:${port}`));
