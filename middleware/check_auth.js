const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log('req.headers',req.headers.authorization);
    const decodeToken = jwt.verify(token, process.env.AUTH_SECRET);
    console.log('decodeToken',decodeToken);
    req.userData = { phoneNo: decodeToken.phoneNo, _id: decodeToken.userId};
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth Failed" })
  }
}