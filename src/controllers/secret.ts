import { Request, Response } from "express";
import Secrets from "../models/secrets";

export class Secret {
  static async create(req: Request, res: Response) {
    try {
      const { secret } = req.body;

      const mySecret = new Secrets({
        secret,
        // @ts-ignore
        userId: req.user.id,
      });
      await mySecret.save();

      return res.status(200).json({
        data: mySecret,
        message: "Keeping your dirty dirty secrets.",
      });
    } catch (err) {
      res.status(500).json({
        data: err,
        message: "server error",
      });
    }
  }
  
  static async getSecret(req: Request, res: Response) {
    try {
      //@ts-ignore
      const secret = await Secrets.find({ userId: req.user.id }).populate(
        "userId",
        ["fullname", "email", "userLocation"]
      );

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
    } catch (err) {
      res.status(500).json({
        data: err,
        message: "server error",
      });
    }
  }
}
