"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
class Auth {
    static Register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullname, email, password, userLocation } = req.body;
                const takenEmail = yield user_1.default.findOne({ email });
                if (takenEmail) {
                    return res.status(400).json({
                        message: "This email belongs to another user.",
                    });
                }
                const passwordHash = yield bcrypt_1.default.hash(password, 10);
                const user = new user_1.default({
                    fullname,
                    email: email.toLowerCase(),
                    password: passwordHash,
                });
                yield user.save();
                // Generate JWT token
                const { _id } = user;
                const userData = {
                    id: _id,
                    fullname,
                    email: email.toLowerCase(),
                };
                const token = jsonwebtoken_1.default.sign({ user: userData }, process.env.MAILGUN_JWT_SECRET || "", {
                    expiresIn: "1d",
                });
                return res.status(200).json({
                    data: { token, user: userData },
                    message: "Accout registration successful.",
                });
            }
            catch (err) {
                res.status(500).json({
                    data: err,
                    message: "server error",
                });
            }
        });
    }
    static Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield user_1.default.findOne({ email: email.toLowerCase() });
                if (!user) {
                    return res.status(400).json({
                        message: "User does not exist.",
                    });
                }
                let randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
                user.otp = randomOtp;
                user.expirationTime = new Date(Date.now() + 3960000); // otp 6 minutes
                yield user.save();
                return res.status(200).json({
                    data: {
                        loginLink: `http://localhost:${process.env.PORT}/api/auth/verify/${randomOtp}`,
                    },
                    message: "Let's just pretend this was sent to your mail, wink wink",
                });
            }
            catch (err) {
                res.status(500).json({
                    data: err,
                    message: "server error",
                });
            }
        });
    }
    static OTPVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTime = new Date(Date.now() + 360000);
                const otp = req.params.otp;
                const user = yield user_1.default.findOne({
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
                const token = jsonwebtoken_1.default.sign({ user: userData }, process.env.MAILGUN_JWT_SECRET || "", {
                    expiresIn: "1d",
                });
                return res.status(200).json({
                    //@ts-ignore
                    data: { token, user },
                    message: "User successfully loggedIn.",
                });
            }
            catch (err) {
                res.status(500).json({
                    data: err,
                    message: "server error",
                });
            }
        });
    }
}
exports.Auth = Auth;
