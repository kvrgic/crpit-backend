const User = require('../../model/user.model');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  username = username.trim();
  email = email.trim();

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'email', msg: 'Email je već zauzet' }]
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        errors: [{ param: 'username', msg: 'Korisničko ime je već zauzeto' }]
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({ success: true, message: "Registracija uspješna", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Greška na serveru" });
  }
};