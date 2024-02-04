const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    try {
        return jwt.verify(token, 'secretKey');
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

const decodeTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token missing' });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    req.decodedToken = decodedToken;
    next();
};

module.exports = decodeTokenMiddleware;
