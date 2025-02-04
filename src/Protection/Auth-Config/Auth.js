const { expressjwt } = require('express-jwt'); // Updated import for express-jwt

const secret = process.env.Secret;
if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables.');
}

// Middleware to check basic JWT authentication
function jwtCheck() {
    return expressjwt({
        secret: secret,
        algorithms: ['HS256'],
    });
}

// Middleware to check JWT with custom revoke logic
function jwtAuth() {
    return expressjwt({
        secret: secret,
        algorithms: ['HS256'],
        isRevoked: revoke,
    });
}

// Function to revoke tokens based on role
async function revoke(req, payload) {
    if (!payload || payload.payload.role !== "admin") {
        return true; // Revoke access
    } 
    return false; // Allow access 
}

module.exports = { jwtCheck, jwtAuth };
