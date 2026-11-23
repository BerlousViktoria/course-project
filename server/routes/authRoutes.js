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

router.post('/register', async (req, res) => {
    try {
        const { email, password, inviteCode } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Введіть email та пароль' });
        }

        if (inviteCode !== process.env.ADMIN_INVITE_CODE) {
            return res.status(403).json({ error: 'Невірний код доступу адміністратора' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль має містити щонайменше 6 символів' });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            token: data.session?.access_token || null,
            user: data.user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        await supabase.auth.signOut();
        res.json({ message: 'Вихід виконано' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;