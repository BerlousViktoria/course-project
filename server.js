const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('./server/config/db');
const authRoutes = require('./server/routes/authRoutes');
const contactRoutes = require('./server/routes/contactRoutes');
const postsRoutes = require('./server/routes/postsRoutes');
const projectsRoutes = require('./server/routes/projectsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', async (req, res) => {
    try{
        const result = await pool.query('SELECT NOW()');
        res.json({ status : 'ok', db_time: result.rows[0].now});
    } catch(err){
        console.error('Помилка підключення до БД: ', err);
        res.status(500).json({ status : 'error', message : err.message});
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/post', postsRoutes);
app.use('/api/projects', projectsRoutes);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на: http://localhost:${PORT}`);
})