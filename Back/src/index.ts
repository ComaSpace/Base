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
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
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

// Endpoint to create a new student
app.post('/api/students', async (req: Request, res: Response) => {
  const { vardas, pavarde, el_pasto_adresas, password, groupIds } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const connection = await connectDB();
    const sql = 'INSERT INTO Students (vardas, pavarde, el_pasto_adresas, password) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute<any>(sql, [vardas, pavarde, el_pasto_adresas, hashedPassword]);

    const insertId = result.insertId; // Retrieve the ID of the newly created student

    // Inserting records into StudentGroups table to assign the student to groups
    if (groupIds && groupIds.length > 0) {
      const insertPromises = groupIds.map((groupId: string) => {
        const sql = 'INSERT INTO StudentGroups (studentId, groupId) VALUES (?, ?)';
        return connection.execute(sql, [insertId, groupId]);
      });

      await Promise.all(insertPromises);
    }

    connection.end();
    res.status(201).send('Student created successfully');
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).send('Error creating student');
  }
});


// Endpoint to update a student's details
app.put('/api/students/:id', async (req: Request, res: Response) => {
  const studentId = req.params.id;
  const { vardas, pavarde, el_pasto_adresas, password, groupIds } = req.body; // Adjust fields as per your requirement
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const connection = await connectDB();
    const updateSql = 'UPDATE Students SET vardas = ?, pavarde = ?, el_pasto_adresas = ?, password = ? WHERE id = ?';
    await connection.execute(updateSql, [vardas, pavarde, el_pasto_adresas, hashedPassword, studentId]);

    // Update StudentGroups table to update group assignments
    if (groupIds && groupIds.length > 0) {
      // First, delete existing associations
      const deleteSql = 'DELETE FROM StudentGroups WHERE studentId = ?';
      await connection.execute(deleteSql, [studentId]);

      // Then, insert new associations
      const insertPromises = groupIds.map((groupId: any) => {
        const sql = 'INSERT INTO StudentGroups (studentId, groupId) VALUES (?, ?)';
        return connection.execute(sql, [studentId, groupId]);
      });

      await Promise.all(insertPromises);
    }

    connection.end();
    res.status(200).send('Student updated successfully');
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Error updating student');
  }
});

// Endpoint to delete a student
app.delete('/api/students/:id', async (req: Request, res: Response) => {
  const studentId = req.params.id;

  try {
    const connection = await connectDB();
    const deleteSql = 'DELETE FROM Students WHERE id = ?';
    await connection.execute(deleteSql, [studentId]);

    // Optionally, delete associations in StudentGroups table
    const deleteGroupSql = 'DELETE FROM StudentGroups WHERE studentId = ?';
    await connection.execute(deleteGroupSql, [studentId]);

    connection.end();
    res.status(200).send('Student deleted successfully');
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Error deleting student');
  }
});

// Endpoint to fetch groups for a student
app.get('/api/student/groups', authenticateToken, async (req: CustomRequest, res: Response) => {
  const studentId = req.user.id; // Assuming user object contains student's ID

  try {
    const connection = await connectDB();
    const sql = `
      SELECT g.id, g.groupName  -- Adjust columns as per your database schema
      FROM Groups g
      JOIN StudentGroups sg ON g.id = sg.groupId
      WHERE sg.studentId = ?
    `;
    const [groups] = await connection.execute<RowDataPacket[]>(sql, [studentId]);

    connection.end();
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching student groups:', error);
    res.status(500).send('Error fetching student groups');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

