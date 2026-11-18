const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');

router.post('/', async (req, res) => {
    try{
        const {name, email, subject, phone, message } = req.body;

        const result = await pool.query(
            `INSERT INTO public.contact_requests (name, email, subject, phone, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [name, email, subject, phone, message]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err){
        res.status(500).json({error : err.message});
    }
});

router.get('/', requireAuth, async (req, res) => {
    try{
        const result = await pool.query(
            `SELECT * FROM public.contact_requests cr
            ORDER BY cr.created_at`);
        
        res.json(result.rows);        
    } catch(err){
        res.status(500).json({error : err.message});
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    try{
        const {id} = req.params;

        const result = await pool.query(
            `DELETE FROM public.contact_requests cr
            WHERE cr.id = $1
            RETURNING *`,
            [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Не знайдено такого звернення' });
        }

        res.json(result.rows[0]);   
    }catch(err){
        res.status(500).json({error : err.message});
    }
})

module.exports = router;