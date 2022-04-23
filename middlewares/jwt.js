const jwt = require("jsonwebtoken");

const Decode = (req, res, next) => {
    try {
        const { token } = req.body;
        var decoded = jwt.verify(token, 'secret');
        req.body.userId = decoded.userid;
        next();
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error, Try again later",
        });
    }
}


const CheckJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        var decoded = jwt.verify(token, 'secret');
        req.userId = decoded.userid;
        next();
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error, Try again later",
        });
    }
}


module.exports = {
    Decode,
    CheckJWT
}