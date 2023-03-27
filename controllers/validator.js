const { body } = require("express-validator");

exports.postAdd = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name should not be empty")
    .custom((value, { req }) => {
      const re = /^[a-zA-Z ]+$/;
      if (!value.match(re)) {
        throw new Error("Name should contain only letters");
      }
      return true;
    })
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Maximum 20 characters long")
    .toLowerCase(),
  body("roll")
    .trim()
    .notEmpty()
    .withMessage("Roll Number should not be empty")
    .isNumeric()
    .withMessage("Roll Number should be a number. "),
  body("cls")
    .trim()
    .notEmpty()
    .withMessage("Class should not be empty")
    .isNumeric()
    .withMessage("Class should be a number. ")
    .toLowerCase(),
  body("registrationNumber")
    .trim()
    .notEmpty()
    .withMessage("Registration No. should not be empty")
    .isAlphanumeric()
    .withMessage("Registration should be Alphanumeric. ")
    .toLowerCase(),
];
