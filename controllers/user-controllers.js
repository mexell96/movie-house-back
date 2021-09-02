const { validationResult } = require("express-validator");

const userService = require("../service/user-service");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error during registration", errors.array())
        );
      }
      const { name, email, password, upload } = req.body;
      const userData = await userService.registration(
        name,
        email,
        password,
        upload
      );
      res.cookie("refreshToken", userData.refreshToken),
        {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        };
      return res.json({ message: "You registered", ...userData });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Error during login", errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.json({ message: "You entered", ...userData });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json({ message: "You logout" });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async userReviews(req, res, next) {
    try {
      const id = req.params.id;
      const reviews = await userService.userReviews(id);
      res.status(200).json(reviews);
    } catch (e) {
      next(e);
    }
  }

  async deleteUserReviews(req, res, next) {
    try {
      const id = req.params.id;
      await userService.deleteUserReviews(id);
      res.status(200).json({ message: "Review has been deleted" });
    } catch (e) {
      next(e);
    }
  }

  async changeName(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error during change name", errors.array())
        );
      }
      const { name } = req.body;
      const id = req.params.id;
      const user = await userService.changeName(name, id);
      res.status(201).json({ ...user, message: "Updated user name" });
    } catch (e) {
      next(e);
    }
  }

  async changeEmail(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error during change email", errors.array())
        );
      }
      const { email } = req.body;
      const id = req.params.id;
      const user = await userService.changeEmail(email, id);
      res.status(201).json({ ...user, message: "Updated user email" });
    } catch (e) {
      next(e);
    }
  }

  async changeTheme(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error during change theme", errors.array())
        );
      }
      const { theme } = req.body;
      const id = req.params.id;
      const user = await userService.changeTheme(theme, id);
      res.status(201).json({ ...user, message: "Updated user theme" });
    } catch (e) {
      next(e);
    }
  }

  async changeRole(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error during change role", errors.array())
        );
      }
      const { role } = req.body;
      const id = req.params.id;
      const user = await userService.changeRole(role, id);
      res.status(201).json({ ...user, message: "Updated user role" });
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      await userService.deleteUser(id);
      res.status(200).json({ message: "User has been deleted" });
    } catch (e) {
      next(e);
    }
  }

  async changePassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error during change password", errors.array())
        );
      }
      const { oldPassword, newPassword } = req.body;
      const id = req.params.id;
      const user = await userService.changePassword(
        oldPassword,
        newPassword,
        id
      );
      res.status(201).json({ ...user._doc, message: "Updated user password" });
    } catch (e) {
      next(e);
    }
  }

  async changeAvatar(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Error during change avatar", errors.array())
        );
      }
      const { avatar } = req.body;
      const id = req.params.id;
      const user = await userService.changeAvatar(avatar, id);
      res.status(201).json({ ...user, message: "Updated user avatar" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
