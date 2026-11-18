const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM public.posts
            ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, tag, content, image_url } = req.body;
        const result = await pool.query(
            `INSERT INTO public.posts (title, tag, content, image_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [title, tag || null, content, image_url || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, tag, content, image_url } = req.body;

        const result = await pool.query(
            `UPDATE public.posts
            SET title = $1,
                tag = $2,
                content = $3,
                image_url = $4
            WHERE id = $5
            RETURNING *`,
            [title, tag || null, content, image_url || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пост не знайдено' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM public.posts
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пост не знайдено' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;