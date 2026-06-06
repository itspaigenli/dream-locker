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

export default router;