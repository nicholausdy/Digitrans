"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const account = __importStar(require("./dbInterface/account"));
async function main() {
    const username = 'test3';
    const password = 'test1.2';
    const email = 'test4@gmail.com';
    const isverified = true;
    const tempcode = 12345;
    //const result1:IResponse = await account.insertAccount(username,password,email,isverified)
    //console.log(result1)
    //const result2:IResponse = await account.readAccount(username)
    //console.log(result2)
    //const result3:IResponse = await account.updatePassword(username,password)
    //console.log(result3)
    //const result4:IResponse = await account.updateVerification(username,isverified)
    //console.log(result4)
    //const result5:IResponse = await account.updateTempCode(username,tempcode)
    //console.log(result5)
    //const result6:IResponse = await account.deleteTempCode(username)
    //console.log(result6)
    //const result7:IResponse = await account.getTempCode(username)
    //console.log(result7)
    const result8 = await account.deleteAccount(username);
    console.log(result8);
}
main();
