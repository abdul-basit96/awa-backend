const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user');
const { Decode, CheckJWT } = require('../middlewares/jwt');

router.post("/signup", UserController.SignUp);
router.post("/login", UserController.Login);
router.post("/reset-password", Decode, UserController.ResetPassword);
router.post("/forgot-password", UserController.ForgotPassword);
router.post("/user/update/:userId", UserController.updateUser);
router.post("/forgot-password/:email", UserController.ForgotPasswordEmail);
router.get("/otp/:email", UserController.SendOTP);
router.get("/user", CheckJWT, UserController.GetUser);
router.get("/verify-user/:email", UserController.VerifyUser);
module.exports = router;