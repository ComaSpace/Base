import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow only specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow only specific headers
  next();
});


const dbConfig = {
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'DB2024'
};

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // File name
  }
});

const upload = multer({ storage: storage });

interface CustomRequest extends Request {
  user?: any;  // Extend the Request interface to include user property
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'yourJWTSecret', (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Endpoint to upload files
app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req: CustomRequest, res: Response) => {
  const lectureId = req.body.lectureId;
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  const fileName = req.file.filename;
  const filePath = req.file.path;

  try {
    const connection = await connectDB();
    const sql = 'INSERT INTO Failai (paskaita_id, pavadinimas, failas) VALUES (?, ?, ?)';
    await connection.execute(sql, [lectureId, fileName, filePath]);
    connection.end();
    res.status(201).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

// Endpoint to delete files
app.delete('/api/files/delete/:fileId', authenticateToken, async (req: CustomRequest, res: Response) => {
  const fileId = req.params.fileId;

  try {
    const connection = await connectDB();
    const [fileResult] = await connection.execute<RowDataPacket[]>('SELECT * FROM Failai WHERE id = ?', [fileId]);

    if (!fileResult || fileResult.length === 0) {
      return res.status(404).send('File not found');
    }

    const filePath = fileResult[0].failas;

    fs.unlinkSync(filePath);

    await connection.execute('DELETE FROM Failai WHERE id = ?', [fileId]);
    connection.end();

    res.status(200).send('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Error deleting file');
  }
});

// Endpoint to toggle file visibility
app.put('/api/files/toggle-visibility/:fileId', authenticateToken, async (req: CustomRequest, res: Response) => {
  const fileId = req.params.fileId;
  const visible = req.body.visible ? 1 : 0;

  try {
    const connection = await connectDB();
    await connection.execute('UPDATE Failai SET rodomas_studentams = ? WHERE id = ?', [visible, fileId]);
    connection.end(); // Close the connection

    res.status(200).send('File visibility toggled successfully');
  } catch (error) {
    console.error('Error toggling file visibility:', error);
    res.status(500).send('Error toggling file visibility');
  }
});

// Register endpoint
app.post('/register', async (req: Request, res: Response) => {
  const { vardas, pavarde, el_pasto_adresas, telefonas, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const connection = await connectDB();
    const sql = 'INSERT INTO Vartotojai (vardas, pavarde, el_pasto_adresas, telefonas, password) VALUES (?, ?, ?, ?, ?)';
    await connection.execute(sql, [vardas, pavarde, el_pasto_adresas, telefonas, hashedPassword]);
    connection.end(); // Close the connection
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// Login endpoint
app.post('/login', async (req: Request, res: Response) => {
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
