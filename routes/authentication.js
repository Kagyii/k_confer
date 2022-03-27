//npm packages
const router = require("express").Router();
const { body } = require("express-validator");

//utility
const suggestedInput = require("../util/suggestion");

//middlewares
const tokenValidator = require("../middlewares/tokenValidator");

//controllers
const signupController = require("../controllers/signup");
const loginController = require("../controllers/login");
const logoutController = require("../controllers/logout");

//routes
router.post(
  "/signup",
  [
    body("email")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required email")
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail()
      .trim()
      .escape(),
    body("password")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required password")
      .isString()
      .withMessage("Required at least one character and one number")
      .trim(),
    body("username")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required username")
      .isString()
      .trim()
      .escape(),
    body("gender")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required gender")
      .isIn(suggestedInput.genderList)
      .withMessage("Invalid gender"),
    body("date_of_birth")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required date of birth")
      .trim()
      .escape(),
    body("country")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required country")
      .isIn(suggestedInput.countryList)
      .withMessage("Invalid country"),
    body("account_type")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required account type")
      .isIn(suggestedInput.accountTypeList)
      .withMessage("Invalid Account Type"),
  ],
  signupController.signUp
);

router.post(
  "/login",
  [
    body("email")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required email")
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail()
      .trim()
      .escape(),
    body("password")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required password")
      .isString()
      .withMessage("Invalid password")
      .trim(),
  ],
  loginController.login
);

router.post(
  "/logout",
  [
    body("logout_mode")
      .exists({ checkNull: true })
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Required logout mode")
      .isIn(["one", "all"])
      .withMessage("Invalid logout mode"),
  ],
  tokenValidator,
  logoutController.logout
);

module.exports = router;
