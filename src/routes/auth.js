const passport = require('passport')
const { loginAndRegisterGoogle } = require('../controllers/authController')

const router = require('express').Router()

passport.serializeUser((user,done)=> done(null,user))
passport.deserializeUser((user,done)=> done(null,user))

/* /auth/login/google */

router.get('/login/google', passport.authenticate('google'))
.get('/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),loginAndRegisterGoogle)

module.exports = router