const Joi = require("joi");
const { successResponse } = require("../../utils/apiResponse");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return next({ statusCode: 400, message: error.message });
      }

      const admin = await this.authService.registerAdmin(value.email, value.password);
      return successResponse(res, admin, "Admin registered successfully.", 201);
    } catch (error) {
      return next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return next({ statusCode: 400, message: error.message });
      }

      const result = await this.authService.login(value.email, value.password);
      return successResponse(res, result, "Login successful.");
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = AuthController;
