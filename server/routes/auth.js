import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { validateSignup } from '../middleware/validateAuth.js';

const router = express.Router();

// Signup
router.post('/signup', validateSignup, async (req, res) => {
    const { username, email, password } = req.body;
    
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
        console.error('Registration Error:', error);
        if (error.code === '23505') {
            const constraint = error.constraint || '';

            if (constraint.includes('email')){
                return res.status(409).json({ error: 'Email already exists' });
            }

            if (constraint.includes('username')){
                return res.status(409).json({ error: 'Username already exists' });
            }

            return res.status(409).json({ error: 'Account already exists' });
        } else {
            res.status(500).json({ error: 'Registration failed.' });
        }
    }
});

// Signin
router.post('/signin', async (req, res) => {
    // Use email or username to login
    const identifier = req.body.identifier?.trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $2`,
            [identifier, identifier.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "JWT secret is missing" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
})

export default router;