"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const account = __importStar(require("./account"));
async function main() {
    const username = 'test';
    const password = 'test';
    const email = 'test@gmail.com';
    const isverified = false;
    let result1 = await account.insertAccount(username, password, email, isverified);
    console.log(result1);
}
main();
