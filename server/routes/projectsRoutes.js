const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');

router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.categories ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.id, p.title, p.image_url, p.category_id,
                    p.client, p.tags, p.project_link, p.description, p.created_at,
                    c.name AS category_name, c.slug AS category_slug
             FROM public.projects p
             LEFT JOIN public.categories c ON p.category_id = c.id
             ORDER BY p.created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT p.id, p.title, p.image_url, p.category_id,
                    p.client, p.tags, p.project_link, p.description, p.created_at,
                    c.name AS category_name, c.slug AS category_slug
             FROM public.projects p
             LEFT JOIN public.categories c ON p.category_id = c.id
             WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Проєкт не знайдено' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, image_url, category_id, client, tags, project_link, description } = req.body;

        if (!title || !image_url) {
            return res.status(400).json({ error: 'Назва та зображення обовʼязкові' });
        }

        const result = await pool.query(
            `INSERT INTO public.projects (title, image_url, category_id, client, tags, project_link, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                title,
                image_url,
                category_id || null,
                client || null,
                tags || null,
                project_link || null,
                description || null
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image_url, category_id, client, tags, project_link, description } = req.body;

        if (!title || !image_url) {
            return res.status(400).json({ error: 'Назва та зображення обовʼязкові' });
        }

        const result = await pool.query(
            `UPDATE public.projects
             SET title = $1,
                 image_url = $2,
                 category_id = $3,
                 client = $4,
                 tags = $5,
                 project_link = $6,
                 description = $7
             WHERE id = $8
             RETURNING *`,
            [
                title,
                image_url,
                category_id || null,
                client || null,
                tags || null,
                project_link || null,
                description || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Проєкт не знайдено' });
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
            `DELETE FROM public.projects p
             WHERE p.id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Проєкт не знайдено' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;