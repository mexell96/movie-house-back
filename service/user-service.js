const UserModel = require("../models/user-model");
const ReviewModel = require("../models/review-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dto/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(name, email, password, upload) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exist`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const activationLink = uuid.v4();

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      theme: "dark",
      avatar:
        (upload &&
          upload.fileList &&
          upload.fileList[0] &&
          upload.fileList[0].thumbUrl) ||
        "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg",
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Incorrect link for activation");
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with that email: ${email} not found`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Wrong password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async userReviews(id) {
    const reviews = await ReviewModel.find({ owner: id });
    return reviews;
  }

  async deleteUserReviews(id) {
    await ReviewModel.findOneAndDelete({ uid: id });
  }

  async changeName(name, id) {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    user.name = name;
    await user.save();
    return user;
  }

  async changeEmail(email, id) {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    user.email = email;
    await user.save();
    return user;
  }

  async changeTheme(theme, id) {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    user.theme = theme;
    await user.save();
    return user;
  }

  async changeRole(role, id) {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    user.role = role;
    await user.save();
    return user;
  }

  async deleteUser(id) {
    await User.findOneAndDelete(id);
  }

  async changePassword(oldPassword, newPassword, id) {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isMatchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({
        message: "Wrong password, try again",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    return user;
  }

  async changeAvatar(avatar, id) {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    user.avatar = avatar;
    await user.save();
    return user;
  }
}

module.exports = new UserService();
