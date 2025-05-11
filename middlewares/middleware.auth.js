import {checkJWT} from "../services/service.auth.js";

export const authJWT = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return res.status(401).json({ error: true, message: "jwt not found" });
  }

  try {
    const { username, userId } = checkJWT(jwt);
    req.user = { username, userId };
    next();
  } catch (e) {
    return res.status(401).json({ error: true, message: "Invalid token" });
  }
};
