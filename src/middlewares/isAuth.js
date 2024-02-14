const jwt = require('jsonwebtoken');

function isUserValid(req, res,next) {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({
      mensaje: "No tienes acceso",
    });
  }

  // split: "Bearer {token}" -> ["Bearer","{token}"]
  const [_, token] = bearer.split(" ");


  try {
    const user = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET);

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      mensaje: "No tienes acceso",
    });
  }
}

module.exports={
    isUserValid,
}