import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'yourUsername',
  password: 'yourPassword',
  database: 'bitlt_database'
});

db.connect();

app.post('/register', async (req, res) => {
  const { vardas, pavarde, el_pasto_adresas, telefonas, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO Vartotojai (vardas, pavarde, el_pasto_adresas, telefonas, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [vardas, pavarde, el_pasto_adresas, telefonas, hashedPassword], (err, result) => {
    if (err) throw err;
    res.status(201).send('User registered');
  });
});

app.post('/login', (req, res) => {
  const { el_pasto_adresas, password } = req.body;
  const sql = 'SELECT * FROM Vartotojai WHERE el_pasto_adresas = ?';

  db.query(sql, [el_pasto_adresas], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: user.id, tipas: user.tipas }, 'yourJWTSecret', { expiresIn: '1h' });
    res.json({ token });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
