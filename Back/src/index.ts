import express from 'express';
import bodyParser from 'body-parser';
import mysql, { Connection, RowDataPacket } from 'mysql2/promise'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const dbConfig = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'DB2024'
};

// Function to connect to MySQL using mysql2/promise
const connectDB = async (): Promise<Connection> => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('MySQL connected');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw new Error('Unable to connect to database');
  }
};

// Register endpoint
app.post('/register', async (req, res) => {
  const { vardas, pavarde, el_pasto_adresas, telefonas, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const connection = await connectDB();
    const sql = 'INSERT INTO Vartotojai (vardas, pavarde, el_pasto_adresas, telefonas, password) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(sql, [vardas, pavarde, el_pasto_adresas, telefonas, hashedPassword]);
    connection.end(); // Close the connection
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { el_pasto_adresas, password } = req.body;
  const sql = 'SELECT * FROM Vartotojai WHERE el_pasto_adresas = ?';

  try {
    const connection = await connectDB();
    const [results] = await connection.execute<RowDataPacket[]>(sql, [el_pasto_adresas]);

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: user.id, tipas: user.tipas }, 'yourJWTSecret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Error logging in user');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
