const express = require('express');
const pool = require('./pg-connection');   // PostgreSQL
const connectMongo = require('./mongo-connection'); // MongoDB
require('dotenv').config();

const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

const port = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send('EduQuery API is running');
});

// PostgreSQL Test
app.get('/pg-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: "Connected to PostgreSQL", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "PostgreSQL Error", error: err.message });
  }
});

// MongoDB Test
app.get('/mongo-test', async (req, res) => {
  try {
    const db = await connectMongo();
    const collections = await db.listCollections().toArray();
    res.json({ status: "Connected to MongoDB", collections: collections.map(c => c.name) });
  } catch (err) {
    res.status(500).json({ status: "MongoDB Error", error: err.message });
  }
});

// General school info
app.get('/api/schools', async (req, res) => {
  try {
    const { name } = req.query;
    const result = await pool.query(
      `SELECT school_id, school_name, address, postal_code, zone_code, mainlevel_code, principal_name
       FROM Schools
       WHERE LOWER(school_name) LIKE LOWER($1)
       LIMIT 20`,
      [`%${name}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// School subjects
app.get('/api/schools/subjects', async (req, res) => {
  try {
    const { name } = req.query;
    const result = await pool.query(
      `SELECT s.school_name, subj.subject_desc
       FROM Schools s
       JOIN School_Subjects ss ON s.school_id = ss.school_id
       JOIN Subjects subj ON subj.subject_id = ss.subject_id
       WHERE LOWER(s.school_name) LIKE LOWER($1)`,
      [`%${name}%`]
    );
    res.json(result.rows.length ? result.rows : [{ school_name: "No match", subject_desc: "N/A" }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// School CCAs
app.get('/api/schools/ccas', async (req, res) => {
  try {
    const { name } = req.query;
    const result = await pool.query(
      `SELECT s.school_name, c.cca_generic_name, sca.cca_customized_name, sca.school_section
       FROM Schools s
       JOIN School_CCAs sca ON s.school_id = sca.school_id
       JOIN CCAs c ON c.cca_id = sca.cca_id
       WHERE LOWER(s.school_name) LIKE LOWER($1)`,
      [`%${name}%`]
    );
    res.json(result.rows.length ? result.rows : [{ school_name: "No match", cca_generic_name: "N/A" }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// School Programmes
app.get('/api/schools/programmes', async (req, res) => {
  try {
    const { name } = req.query;
    const result = await pool.query(
      `SELECT s.school_name, p.moe_programme_desc
       FROM Schools s
       JOIN School_Programmes sp ON s.school_id = sp.school_id
       JOIN Programmes p ON p.programme_id = sp.programme_id
       WHERE LOWER(s.school_name) LIKE LOWER($1)`,
      [`%${name}%`]
    );
    res.json(result.rows.length ? result.rows : [{ school_name: "No match", moe_programme_desc: "N/A" }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// School Distinctives
app.get('/api/schools/distinctives', async (req, res) => {
  try {
    const { name } = req.query;
    const result = await pool.query(
      `SELECT s.school_name, d.alp_domain, d.alp_title, d.llp_domain1, d.llp_title
       FROM Schools s
       JOIN School_Distinctives sd ON s.school_id = sd.school_id
       JOIN Distinctive_Programmes d ON d.distinctive_id = sd.distinctive_id
       WHERE LOWER(s.school_name) LIKE LOWER($1)`,
      [`%${name}%`]
    );
    res.json(result.rows.length ? result.rows : [{ school_name: "No match", alp_domain: "N/A" }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server (always last)
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
