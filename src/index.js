// AuthGuard - Authentication and authorization middleware
const jwt = require('jsonwebtoken');

class AuthGuard {
    constructor(secret) {
        this.secret = secret;
    }
    
    generateToken(payload) {
        return jwt.sign(payload, this.secret, { expiresIn: '24h' });
    }
    
    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            return null;
        }
    }
    
    middleware() {
        return (req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }
            
            const decoded = this.verifyToken(token);
            if (!decoded) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            
            req.user = decoded;
            next();
        };
    }
}

module.exports = AuthGuard;
