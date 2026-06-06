import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { hashPassword, comparePassword } from '../utils/password.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)' 
      });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role`,
            [username, email, hashedPassword, 'dreamer']
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            const detail = error.detail || '';

            if (detail.includes('email')){
                return res.status(409).json({ error: 'Email already exists' });
            }

            if (detail.includes('username')){
                return res.status(409).json({ error: 'Username already exists' });
            }

            return res.status(409).json({ error: 'Account already exists' });
        }
        res.status(500).json({ error: 'Registration failed.' });
    }
})

// Signin

export default router;