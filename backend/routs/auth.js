import { Router } from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
const { compare } = bcrypt;
import auth from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv'
dotenv.config()

import User from '../models/User.js';


// @route    POST /auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
    '/',
    [
        check('username', 'Username is required').exists(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            const jwtSecret = process.env.jwtSecret
            sign(
                payload,
                jwtSecret,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.status(202).json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);



// @route    POST /auth/register
// @desc     Register user
// @access   Public
router.post(
    '/register',
    [
        check('username', 'Please include a valid username').exists(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });

            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
            }

            user = new User({
                username,
                password
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            const jwtSecret = process.env.jwtSecret


            jwt.sign(
                payload,
                jwtSecret,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.status(201).json({
                        token,
                        success: true,
                        message: "User created!",
                        errors: []
                    });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

export default router;