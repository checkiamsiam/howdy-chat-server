const router = require("express").Router();

router.use("/user", (req, res) => {
  res.send({ success: true });
});

module.exports = router;
