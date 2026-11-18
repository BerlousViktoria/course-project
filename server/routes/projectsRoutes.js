const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');

router.get('/categories', async(res, req) => {
    try{
        const result = await pool.query(`SELECT * FROM public.categories ORDER BY id ASC`);
        res.json(result.rows);
    } catch(err){
        res.status(500).json({error : err.message});
    }
})

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.id, p.title, p.description, p.image_url, p.category_id, p.created_at,
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

router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, description, image_url, category_id } = req.body;

        const result = await pool.query(
            `INSERT INTO public.projects (title, description, image_url, category_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [title, description, image_url, category_id || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/', requireAuth, async (req, res) => {
    try{
        const {title, description, image_url, category_id } = req.body;

        const result = await pool.query(
            `SELECT p.id, p.title, p.description, p.image_url, p.category_id, p.created_at,
                    c.name AS category_name, c.slug AS category_slag
            FROM public.projects p
            LEFT JOIN public.categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC`
        );

        res.status(201).json(result.rows[0]);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image_url, category_id } = req.body;

        const result = await pool.query(
            `UPDATE public.projects
             SET title = $1,
                 description = $2,
                 image_url = $3,
                 category_id = $4
             WHERE id = $5
             RETURNING *`,
            [title, description, image_url, category_id || null, id]
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
    try{
        const {id} = req.params.id;

        const result = await pool.query(
            `DELETE FROM public.projects p
            WHERE p.id = $1
            RETURNING *`,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({error : 'Проєкт не знайдено'});
        }

        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;