var jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
    if (process.env.AUTH_NEEDED == "true") {
        let token = req.headers.token;
        try {
            jwt.verify(token, process.env.SECRET_KEY)
            let decoded = jwt.decode(token);
            req.headers["userdata"] = decoded
            next();

        } catch (error) {
            res.json({ message: "Unauthorized Request", status: false })
            return;
        }

    } else {
        next();
    }
}

module.exports = {
    authenticate
}
