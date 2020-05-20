"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const accountHandler = __importStar(require("./handler/account"));
async function main() {
    const username = 'nicdanyosss';
    const password = 'JackDullBoy1999';
    const email = 'nicdanyos@gmail.com';
    //const result1 : IResponse = await accountHandler.registerUser(username,password,email)
    //console.log(result1)
    const result2 = await accountHandler.changeVerificationStatus(username);
    console.log(result2);
}
main();
