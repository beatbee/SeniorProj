const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Retrieve token from the 'token' cookie
    const token = req.cookies.token;

    if (token == null) return res.sendStatus(401);  // No token, unauthorized

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);  // Invalid or expired token, forbidden

        req.user = user;  // Attach user info to req.user
        next();  // Proceed to the next middleware or route
    });
}

module.exports = authenticateToken;
