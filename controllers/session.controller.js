const connection = require("../connectionDB/connectionDB");
const passport = require("../config/passport");

/*
module.exports = {

    login_get: function (req, res) {
        res.render("session/login");
    },

    /*
        login_post: async function (req, res, next) {
            passport.authenticate('local', async (err, usuario, info) => {
                try {
                    await connection();
                    
                    if (err || !usuario) {
                        const error = new Error('An error occurred.');
                        console.log("error usuario");
                        return res.render("session/login", error);
                    }
                    
                    req.login(usuario, { session: false }, async (error) => {
                        if (error) return next(error);
                        return res.redirect("/");
                    });
    
                } catch (error) {
                    return next(error);
                }
            })(req, res, next);
        },
    */


/*
    login_post: async function (req, res, next) {
        await connection();
        passport.authenticate('local', function (err, usuario, info) {
            if (err) { return next(err); }
            if (!usuario) { return res.status(401).send({ message: info.message }); }
            req.login(usuario, function (err) {
                if (err) { return next(err); }
                return res.redirect("/");
            });
        })(req, res, next);
    },



    logout: function (req, res) {
        req.logout();
        res.redirect("/");
    },


    forgotPassword_get: async function (req, res) {
        res.render("session/forgotPassword");
    },


    forgotPassword_post: async function (req, res) {

    },


}
*/