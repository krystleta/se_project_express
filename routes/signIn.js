const router = require("express").Router();
const { createUser, loginUser } = require("../controllers/users");
const { validateReturningUser, validateNewUser } = require("../middlewares/validation");

router.post("/signin", validateReturningUser, loginUser);
router.post("/signup", validateNewUser, createUser);

module.exports = router;