const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try{
        const result = await pool.query(
            `SELECT * FROM public.posts
            ORDER BY ps.created_at DESC`);
        res.status(result.rows);
    } catch(err){
        res.status(500).json({error : err.message});
    }
});

router.post('/', requireAuth, async(req, res) => {
    try{
        const {title, tag, content, image_url, created_at} = req.body;
        const result = await pool.query(
            `INSERT INTO public.posts (title, tag, content, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [title, tag, content, image_url, created_at || null]
        );

        res.status(201).json(result.rows[0]);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    try{
        const {id} = req.params.id;
        const {title, tag, content, image_url} = req.body;

        const result = await pool.query(
            `UPDATE public.posts
            SET title = $1,
                tag = $2,
                content = $3,
                image_url = $4,
            WHERE id = $5
            RETURNING *`,
            [title, tag, content, image_url, created_at]
        );

        if(result.rows.length === 0){
            return res.status(404).json({eror : 'Пост не знайдено'});
        }

        res.json(result.rows);
    }catch(err){
        res.status(500).json({error : err.message});
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    try{
        const {id} = req.params.id;

        const result = await pool.query(
            `DELETE FROM public.posts p
            WHERE p.id = $1
            RETURNING *`,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({error : err.message});
        }
    }catch(err){
        res.status(500).json({error : err.message});
    }
})

module.exports = router;