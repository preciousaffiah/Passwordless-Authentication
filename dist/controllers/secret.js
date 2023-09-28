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
exports.Secret = void 0;
const secrets_1 = __importDefault(require("../models/secrets"));
class Secret {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { secret } = req.body;
                const mySecret = new secrets_1.default({
                    secret,
                    // @ts-ignore
                    userId: req.user.id,
                });
                yield mySecret.save();
                return res.status(200).json({
                    data: mySecret,
                    message: "Keeping your dirty dirty secrets.",
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
    static getSecret(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //@ts-ignore
                const secret = yield secrets_1.default.find({ userId: req.user.id }).populate("userId", ["fullname", "email", "userLocation"]);
                if (!secret) {
                    return res.json({
                        data: null,
                        message: "You do not have any secrets, lol",
                    });
                }
                return res.status(200).json({
                    data: secret,
                    message: "omg here's your nasty secret",
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
exports.Secret = Secret;
