const router = require("express").Router();
const { createUser, loginUser } = require("../controllers/users");


router.post("/signin", loginUser);
router.post("/signup", createUser);

module.exports = router;