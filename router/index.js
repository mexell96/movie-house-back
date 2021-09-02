const Router = require("express").Router;
const router = new Router();

const userController = require("../controllers/user-controllers");
const reviewController = require("../controllers/review-controllers");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const { check } = require("express-validator");

router.post(
  "/registration",
  [
    check("name", "Minimum length name 2 symbols").isLength({ min: 2 }),
    check("email", "Wrong email").isEmail(),
    check("password", "Minimum length password 6 symbols").isLength({ min: 6 }),
  ],
  userController.registration
);
router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  userController.login
);
router.get("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.post(
  "/create-review",
  [
    check("avatar", "Choose avatar").exists(),
    check("movie", "Choose movie").exists(),
    check("movieId", "Choose movie").exists(),
    check("name", "Minimum length name 2 symbols").isLength({ min: 2 }),
    check("rating", "Specify the rating").exists(),
    check("review", "Minimum length review 2 symbols").isLength({ min: 2 }),
    check("uid", "Minimum length uid 2 symbols").isLength({ min: 2 }),
    check("owner", "Specify the user").exists(),
  ],
  reviewController.createReview
);

router.get("/reviews/:id", reviewController.getReviews);
router.delete(
  "/root-delete-user/:id",
  roleMiddleware(["SUPERADMIN"]),
  userController.deleteUser
);
router.patch(
  "/root-user-name/:id",
  roleMiddleware(["SUPERADMIN", "ADMIN"]),
  [check("name", "Minimum length name 2 symbols").isLength({ min: 2 })],
  userController.changeName
);
router.patch(
  "/root-user-email/:id",
  roleMiddleware(["SUPERADMIN", "ADMIN"]),
  [check("email", "Wrong email").isEmail()],
  userController.changeEmail
);
router.patch(
  "/user-name/:id",
  authMiddleware,
  [check("name", "Minimum length name 2 symbols").isLength({ min: 2 })],
  userController.changeName
);
router.patch(
  "/user-email/:id",
  authMiddleware,
  [check("email", "Wrong email").isEmail()],
  userController.changeEmail
);
router.patch(
  "/user-password/:id",
  authMiddleware,
  [
    check("oldPassword", "Minimum length password 6 symbols").isLength({
      min: 6,
    }),
    check("newPassword", "Minimum length password 6 symbols").isLength({
      min: 6,
    }),
  ],
  userController.changePassword
);
router.patch(
  "/user-avatar/:id",
  authMiddleware,
  [check("avatar", "Choose avatar").exists()],
  userController.changeAvatar
);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.patch(
  "/user-theme/:id",
  authMiddleware,
  [check("theme", "Choose a theme").exists()],
  userController.changeTheme
);
router.get("/user-reviews/:id", authMiddleware, userController.userReviews);
router.delete(
  "/user-reviews/:id",
  authMiddleware,
  userController.deleteUserReviews
);
router.patch(
  "/root-user-role/:id",
  roleMiddleware(["SUPERADMIN", "ADMIN"]),
  [check("role", "Choose another role").exists()],
  userController.changeRole
);
router.get(
  "/users",
  roleMiddleware(["SUPERADMIN", "ADMIN"]),
  userController.getUsers
);

module.exports = router;
