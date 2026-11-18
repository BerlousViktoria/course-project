const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ error: 'Невірний email або пароль' });
        }

        res.json({
            token: data.session.access_token,
            user: data.user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;