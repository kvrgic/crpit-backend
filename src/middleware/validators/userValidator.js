const { body } = require('express-validator');

exports.registerValidation = [
  body('username') 
    .notEmpty().withMessage('Ime je obavezno'),

  body('email')
    .isEmail().withMessage('Unesite ispravan email'),

  body('password')
    .isLength({ min: 6 }).withMessage('Lozinka mora imati barem 6 karaktera')
    .matches(/[A-Z]/).withMessage('Lozinka mora sadržavati barem jedno veliko slovo')
    .matches(/[0-9]/).withMessage('Lozinka mora sadržavati barem jedan broj')
    .matches(/[^A-Za-z0-9]/).withMessage('Lozinka mora sadržavati barem jedan specijalni znak')
];