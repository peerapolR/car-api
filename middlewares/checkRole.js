module.exports.isNurse = (req, res, next) => {
  const { role } = req.user;
  if (role === "nurse") {
    next();
  } else {
    return res.status(403).json({
      error: {
        message: "Nurse only",
      },
    });
  }
};
