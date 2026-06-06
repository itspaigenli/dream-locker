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
            return res.status(409).json({ error: 'Username or Email already exists' });
        }
        res.status(500).json({ error: 'Registration failed.' });
    }
})

// Signin

export default router;