const router = require("express").Router();
const RESPONSE_CODES = require("../utils/errors");
const clothingItem = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(RESPONSE_CODES.SERVER_ERROR).send({ message: "Router not found." });
});

module.exports = router;