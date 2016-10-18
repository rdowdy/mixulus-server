var User = require('../models/user');
var jwt = require('jsonwebtoken');
var bCrypt = require('bcrypt');

module.exports = function(req, res) {

    // find the user
    User.findOne({
        email: req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (!isValidPassword(user, req.body.password)) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                console.log("JWT authentication success");
                // if user is found and password is right
                // create a token
              	// but first remove password from user object
              	user.password = null;
                var token = jwt.sign(user, 'superDuperSecret', {
                    expiresIn: 60*60*24// expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    token: token
                });
            }

        }

    });
}

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}
