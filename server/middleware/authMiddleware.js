import jwt from 'jsonwebtoken';

// Ensures the request has a valid token before proceeding
export const authMiddleware = (req, res, next) => {
    // Extract the Authorization header (Expected format: "Bearer <TOKEN>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify token signature and expiration against JWT_SECRET
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Attach verified user payload (id, username, role) to the request object
        req.user = verified;
        // Pass control to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

// Middleware to authorize specific roles
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Ensure authentication middleware ran successfully first
        if (!req.user) {
            return res.status(401).json({ error: 'Login first.' });
        }

        // Check if the user's role is included in the permitted roles list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Sorry, You do not have permission to access this resource.' });
        }

        // Role authorized, proceed to the route handler
        next();
    }
}