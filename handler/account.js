"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const accountDBInterface = __importStar(require("../dbInterface/account"));
const bcrypt = __importStar(require("bcrypt"));
const nodemailer = require('nodemailer');
const os = __importStar(require("os"));
require('dotenv').config();
async function hashPassword(password) {
    let resp = { Status: '', Message: '' };
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        resp.Status = 'Success';
        resp.Message = hashedPassword;
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = 'Hashing failed';
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
async function comparePassword(plainTextPassword, hashedPassword) {
    let resp = { Status: '', Message: '' };
    try {
        const isMatched = await bcrypt.compare(plainTextPassword, hashedPassword);
        resp.Status = 'Success';
        resp.Message = isMatched;
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = 'Hashing comparison failed';
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
async function registerUser(username, password, email) {
    let resp = { Status: '', Message: '' };
    const hashResult = await hashPassword(password);
    if (hashResult.Status == 'Success') {
        resp = await accountDBInterface.insertAccount(username, hashResult.Message, email, false);
        if (resp.Status == 'Success') {
            const url = await getURL();
            resp = await mailer(email, url.concat('/', username));
            if (resp.Status == 'Success') {
                resp.Code = 200;
            }
            else {
                resp.Code = 500;
                const deleteResult = accountDBInterface.deleteAccount(username);
                console.log(deleteResult);
            }
        }
        else {
            resp.Code = 500;
            if (resp.Message == 'Primary key already exists') {
                resp.Message = 'Username already exists';
            }
        }
    }
    else {
        resp = hashResult;
        resp.Code = 500;
    }
    return resp;
}
exports.registerUser = registerUser;
async function mailer(email, url) {
    let resp = { Status: '', Message: '' };
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Digitrans Questionnaire Platform Account',
            text: 'Thank you for registering your account for the first time.\nClick this link to verify your account: '.concat(url)
        };
        const mailerResult = await transporter.sendMail(mailOptions);
        resp.Status = 'Success';
        resp.Message = 'Verification email has been sent';
        resp.Detail = mailerResult;
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = 'Email failed to be sent, please re-register';
        resp.Detail = e;
    }
    return resp;
}
async function getURL() {
    const networkInterfaces = os.networkInterfaces();
    const ipAddress = networkInterfaces.lo[0].address;
    return ipAddress.concat(':3000/api/v1/account/verify');
}
//verify account
async function changeVerificationStatus(username) {
    let resp = { Status: '', Message: '' };
    resp = await accountDBInterface.updateVerification(username, true);
    if (resp.Status == 'Success') {
        resp.Code = 200;
        resp.Message = 'Account has been verified';
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.changeVerificationStatus = changeVerificationStatus;
//login -- check if username found, password right, and account has been verified / not
//delete later
//async function main() {
//    const plainTextPassword : string = 'hell'
//const email:string = 'nicdanyos@gmail.com'
//const url:string = 'http://127.0.0.1:3000/verifyAccount'
//    const result1 : IResponse = await hashPassword(plainTextPassword)
//    console.log(result1)
//    const result2 : IResponse = await comparePassword(plainTextPassword + 'a', result1.Message) 
//    console.log(result2)
//    const result3 : IResponse = await mailer(email,url)
//    console.log(result3)
//}
//main()
