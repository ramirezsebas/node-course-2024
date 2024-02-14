const isAdmin = (req, res, next) => {
  const user = req.user;

  if (user.role.toUpperCase() !== "ADMIN") {
    return res.status(403).json({
      mensaje: "No tienes permiso",
    });
  }

  next();
};

module.exports = {
  isAdmin,
};
