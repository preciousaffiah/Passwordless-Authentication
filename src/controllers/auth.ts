import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";

export class Auth {
  static async Register(req: Request, res: Response) {
    try {
      const { fullname, email, password, userLocation } = req.body;

      const takenEmail = await User.findOne({ email });
      if (takenEmail) {
        return res.status(400).json({
          message:
            "This email belongs to another user.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        fullname,
        email: email.toLowerCase(),
        password: passwordHash,
      });
      await user.save();

      // Generate JWT token
      const { _id } = user;
      const userData = {
        id: _id,
        fullname,
        email: email.toLowerCase(),
      };
      const token = jwt.sign(
        { user: userData },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        data: { token, user: userData },
        message: "Accout registration successful.",
      });
    } catch (err) {
      res.status(500).json({
        data: err,
        message: "server error",
      });
    }
  }

  static async Login(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({
          message: "User does not exist.",
        });
      }

      let randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = randomOtp;
      user.expirationTime = new Date(Date.now() + 3960000); // otp 6 minutes
      await user.save();

      return res.status(200).json({
        data: {
          loginLink: `http://localhost:${process.env.PORT}/api/auth/verify/${randomOtp}`,
        },
        message: "Let's just pretend this was sent to your mail, wink wink",
      });
    } catch (err) {
      res.status(500).json({
        data: err,
        message: "server error",
      });
    }
  }

  static async OTPVerification(req: Request, res: Response) {
    try {
      const currentTime = new Date(Date.now() + 360000);
      const otp = req.params.otp;
      const user = await User.findOne({
        //@ts-ignore
        otp,
        expirationTime: { $gt: currentTime },
      }).select(["_id", "fullname", "email", "userLocation"]);

      if (!user) {
        return res.status(401).json({
          data: null,
          message: "Invalid or expired OTP.",
        });
      }

      // Generate JWT token
      const { _id, fullname, email } = user;
      const userData = {
        id: _id,
        fullname,
        email,
        otp: req.params.otp,
      };

      const token = jwt.sign(
        { user: userData },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "1d",
        }
      );
      return res.status(200).json({
        //@ts-ignore
        data: { token, user },
        message: "User successfully loggedIn.",
      });
    } catch (err) {
      res.status(500).json({
        data: err,
        message: "server error",
      });
    }
  }
}
