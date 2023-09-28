"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = void 0;
const axios_1 = __importDefault(require("axios"));
function getLocation() {
    axios_1.default
        .get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.ABSTRACRT_API_KEY}&fields=country`)
        .then((response) => {
        return response.data;
    })
        .catch((error) => {
        return error;
    });
}
exports.getLocation = getLocation;
