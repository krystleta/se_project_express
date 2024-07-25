const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const signInRouter = require("./signIn");
const { NotFoundError } = require("../errors/not-found");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.use("/", signInRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Router not found.'));
});

module.exports = router;