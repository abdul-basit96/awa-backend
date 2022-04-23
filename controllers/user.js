const UserModel = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');



const SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(409).send({
      message: "Email Already Registered"
    })
  } else {
    bcrypt.hash(password, 10, async function (err, hash) {
      const hashPassword = hash;
      let user = new UserModel({ name, email, age, address, gender, number, photo, type, password: hashPassword });
      try {
        await user.save();
        res.status(201).send(user);
      } catch (err) {
        res.status(500).json({
          error: "Internal Server Error",
        });
      }
    });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "Invalid Email",
        });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).json({
            message: "Internal Server Error, Try again later",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userid: user.id,
            },
            "secret",
          );
          if(!user.verified){
            return res.status(409).json({
              message: "Email not verified, contact support team",
            });
          }
          return res.status(200).json({
            message: "Auth Successfull",
            token: token
          });
        } else {
          return res.status(404).json({
            message: "Invalid Password",
          });
        }
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: "Internal Server Error",
      });
    });
};

const GetUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(409).send({
        message: "Internal Server Error, Try again later"
      })
    }
    res.status(200).send({ user });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

const ResetPassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(409).send({
      message: "Internal Server Error, Try again later"
    })
  } else {
    bcrypt.compare(oldPassword, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error, Try again later",
        });
      }
      if (!result) {
        return res.status(409).send({
          message: "Invalid old password"
        })
      } else {
      }
      bcrypt.hash(newPassword, 10, async function (err, hash) {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error, Try again later",
          });
        }
        const hashPassword = hash;
        // let user = new UserModel({ name, email, password: hashPassword });
        try {
          user.password = hashPassword;
          await user.save();
          res.status(200).send(user);
        } catch (err) {
          res.status(500).json({
            error: "Internal Server Error",
          });
        }
      });
    });
  }
};

const updateUser = async (req, res) => {
  try{
    const { userId } = req.params;
    const { name, age, address, gender, number, photo, type } = req.body;
    const user = await UserModel.findByIdAndUpdate(userId, {
      name, age, address, gender, number, photo, type
    });
    res.status(200).send({user});
  if (!user) {
    return res.status(409).send({
      message: "Internal Server Error, Try again later"
    })
  } else {

  }
  }catch(e){
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

const SendOTP = async (req, res) => {
  try {
    const { email } = req.params;
    sgMail.setApiKey(process.env.SENDGRID_APIKEY);
    const otp = Math.floor(100000 + Math.random() * 900000);

    const msg = {
      to: email, // Change to your recipient
      from: process.env.FROMEMAIL, // Change to your verified sender
      subject: 'FPID OTP',
      // text: 'and easy to do anywhere, even with Node.js',
      html: `<p><strong>${otp}</strong> is your OTP</p>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).send({otp});
      })
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}


const ForgotPassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(409).send({
      message: "Internal Server Error, Try again later"
    })
  } else {
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error, Try again later",
        });
      }
      const hashPassword = hash;
      try {
        user.password = hashPassword;
        await user.save();
        res.status(200).send(user);
      } catch (err) {
        res.status(500).json({
          error: "Internal Server Error",
        });
      }
    });
  }

};

const VerifyUser = async (req, res) => {
try {
  const { email } = req.params;
  const user = await UserModel.findOne({email});
    if (!user) {
      return res.status(409).send({
        message: "Internal Server Error, Try again later"
      })
    }
    user.verified = true;
    await user.save();

    res.status(200).send(user);
} catch (e) {
  res.status(500).json({
    error: "Internal Server Error",
  });
}

}

const ForgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.params;
    sgMail.setApiKey(process.env.SENDGRID_APIKEY);
    const msg = {
      to: email, // Change to your recipient
      from: process.env.FROMEMAIL, // Change to your verified sender
      subject: 'FPID Forgot Password',
      // text: 'and easy to do anywhere, even with Node.js',
      html: `<strong>Click <a href='http://localhost:3000/forgot-password/${email}'>here</a> to reset password</strong>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        res.status(200).send('Email sent successfully');
      })
      .catch((error) => {
        res.status(500).json({
          error: "Internal Server Error",
        });
      })
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

module.exports = {
  SignUp,
  Login,
  ResetPassword,
  ForgotPassword,
  ForgotPasswordEmail,
  GetUser,
  SendOTP,
  VerifyUser,
  updateUser
}