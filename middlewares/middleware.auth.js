import {checkJWT} from "../services/service.auth.js";

export const authJWT = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return res.status(401).json({ error: true, data:{message:"jwt not found"} });
  }

  try {
    const { username, userId } = checkJWT(jwt);
    req.user = { username, userId };
    next();
  } catch (e) {
    return res.status(401).json({ error: true, data:{message: "Invalid token"} });
  }
};
