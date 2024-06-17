const router = require("express").Router();
const RESPONSE_CODES = require("../utils/errors");
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const signInRouter = require("./signIn");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.use("/", signInRouter);

router.use((req, res) => {
  res.status(RESPONSE_CODES.NOT_FOUND).send({ message: "Router not found." });
});

module.exports = router;