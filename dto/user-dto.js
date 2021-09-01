module.exports = class UserDto {
  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.role = model.role;
    this.theme = model.theme;
    this.avatar = model.avatar;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
