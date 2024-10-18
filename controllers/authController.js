const User = require('../../project_root/models/User');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    const { name, email, username, password } = req.body;

    // Check for existing user
    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(400).send('Username already exists');
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, username, password: hashedPassword });
    await newUser.save();

    res.redirect('/login');
};
