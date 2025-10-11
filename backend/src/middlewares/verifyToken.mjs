import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const { token } = req.cookies;

  console.log(req);
  console.log(req.cookies);
  console.log(req.headers)

  if (!token) {
    return res.status(401).send("Not authorized - no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded token payload to request
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token");
  }
};
