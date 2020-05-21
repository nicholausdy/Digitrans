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
    const username = 'nicdanyos';
    const password = 'swordbeach';
    const email = 'nicdanyos@gmail.com';
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY2RhbnlvcyIsImlhdCI6MTU5MDA1OTczMiwiZXhwIjoxNTkwMTQ2MTMyfQ.A5LBQcj4awvocbyADAP2tAQ-HwVUFo0JcG4IFk0K8c0N2nj-xnZcNzHELAKj0-dkw5QQu0KSpqWXnmMVvtZ_ssXAuykweUobruApw11zL_hw53Vt94d3mB-tuXDcrvLorrbU2ldvv-O0jr-GrWyCpUpBXrGOhXDNUy8XW0pdtWv3NCUwnkt1PUWfIWFvsEIii3Xv87_KHDVJYoyWw0n_7OuXic_kXHXabXdSCMCEqbLfjf-yCitjMj0DhXHc-aXiP3kTbTk_vjenx_33mbJk-AfUOHmqx76WwCJA4Ko2U1FoexO6XBezw2a90CR2fNJWmem8GJg4Ni7ZY_Gqg__1Pvu3wQUfZ5l0jlA54esf1tIfZ6I8agdRpSzPVz2yjkhY9KhpIF8mY5_EhGM4zvW6qHDSCvUXC8rE6zPKppfBu-nGxHNGoXlf3rU68XLd7eMaJFRN6qJ7sMBr6ltLMs65ZeTNGrzmkGNOz2iQWVHmYwBwq-zQ97MJ8jnsDVQ-KQO13MK46UJvRrxI_OxFLFMtpM2NCsWDwY3xNUgB6KnGM3v6UQgHXMg72RyzU0fsqOoLMKv46oZiZcuW_OUIOqARkS7xrHBdAYe2l7l6--Kh2HFU1VHgofj3tetiOhPtxuRjhszmgAf_mQPB7YznX1bLWHXgY0sO27mcMWiqzxlnDXs';
    const req = { headers: { 'authorization': token }, body: '' };
    const tempcode = 438733524;
    const newpassword = 'swordbeach';
    //const result1 : IResponse = await accountHandler.registerUser(username,password,email)
    //console.log(result1)
    //const result2 : IResponse = await accountHandler.changeVerificationStatus(username)
    //console.log(result2)
    //const result3 : IResponse = await accountHandler.validateCredentials(username,password)
    //console.log(result3)
    const result4 = await accountHandler.login(username, password);
    console.log(result4);
    //const result5 : IResponse = await accountHandler.verifyJWT(token)
    //console.log(result5)
    //const result6 : IResponse = await accountHandler.verifyRequest(req)
    //console.log(result6)
    //const result7 : IResponse = await accountHandler.createTempToken()
    //console.log(result7)
    //const result8 : IResponse = await accountHandler.insertTempCode(username)
    //console.log(result8)
    //const result9 : IResponse = await accountHandler.removeTempCode(username)
    //console.log(result9)
    //const result10 : IResponse = await accountHandler.mailerForChangingPassword(email,11111)
    //console.log(result10)
    //const result11 : IResponse = await accountHandler.requestChangePassword(username)
    //console.log(result11)
    //const result12 : IResponse = await accountHandler.changePassword(username,tempcode,newpassword)
    //console.log(result12)
}
main();
