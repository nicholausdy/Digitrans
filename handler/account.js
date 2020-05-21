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
const jwt = __importStar(require("jsonwebtoken"));
const fs = __importStar(require("fs"));
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
            //add token to url for added security
            const privateKey = fs.readFileSync(__dirname.concat('/jwtRS256.key'));
            const passphrase = process.env.JWT_PASSPHRASE;
            const token = jwt.sign({ username: username }, { key: privateKey, passphrase: passphrase }, { algorithm: "RS256", expiresIn: 1800 });
            resp = await mailerForVerification(email, url.concat('/account/verify', '/', username, '/', token));
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
async function mailerForVerification(email, url) {
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
            text: 'Thank you for registering your account for the first time.\nClick this link to verify your account (link will expire in 30 minutes): '.concat(url)
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
    let resp = '';
    const hostURL = process.env.HOST_URL;
    if (typeof hostURL === 'undefined') {
        resp = 'Problems encountered. Please contact the administrator';
    }
    else {
        resp = hostURL.concat('/api/v1');
    }
    return resp;
}
//verify account
async function changeVerificationStatus(username, token) {
    let resp = { Status: '', Message: '' };
    const token_check = await verifyJWT(token);
    if (token_check.Status == 'Failed') {
        resp = token_check;
        resp.Code = 403;
    }
    else {
        //check whether username in token = requested username
        if (token_check.Message.username == username) {
            resp = await accountDBInterface.updateVerification(username, true);
            if (resp.Status == 'Success') {
                resp.Code = 200;
                resp.Message = 'Account has been verified';
            }
            else {
                resp.Code = 500;
            }
        }
        else {
            resp.Status = 'Failed';
            resp.Code = 403;
            resp.Message = 'Invalid token';
        }
    }
    return resp;
}
exports.changeVerificationStatus = changeVerificationStatus;
//validate username and password
async function validateCredentials(username, password) {
    let resp = { Status: '', Message: '' };
    const passwordSearchResult = await accountDBInterface.readAccount(username);
    if (passwordSearchResult.Status == 'Failed') {
        resp = passwordSearchResult;
        resp.Code = 500;
        return resp;
    }
    else {
        const compare = await comparePassword(password, passwordSearchResult.Message.password);
        //hashing function failed
        if (compare.Status == 'Failed') {
            compare.Code = 500;
        }
        else {
            compare.Code = 200;
        }
        return compare;
    }
}
//login -- check if username found, password right, and account has been verified / not
async function login(username, password) {
    let resp = { Status: '', Message: '' };
    try {
        const isCredentialValid = await validateCredentials(username, password);
        //generate token only when username and password are validated + account is verified
        if ((isCredentialValid.Status == 'Success') && (isCredentialValid.Message)) {
            const verification_result = await accountDBInterface.readAccount(username);
            if (!(verification_result.Message.isverified)) {
                resp.Status = 'Failed';
                resp.Message = 'Account has not been verified';
                resp.Code = 500;
            }
            else {
                const privateKey = fs.readFileSync(__dirname.concat('/jwtRS256.key'));
                const passphrase = process.env.JWT_PASSPHRASE;
                const token = jwt.sign({ username: username }, { key: privateKey, passphrase: passphrase }, { algorithm: "RS256", expiresIn: '24h' });
                resp.Status = 'Success';
                resp.Detail = token;
                resp.Message = 'User authentication successful';
                resp.Code = isCredentialValid.Code;
            }
        }
        else {
            if (isCredentialValid.Status == 'Failed') {
                resp.Status = 'Failed';
                resp.Message = isCredentialValid.Message;
                resp.Code = 401;
            }
            if (!(isCredentialValid.Message)) {
                resp.Status = 'Failed';
                resp.Message = 'Wrong password';
                resp.Code = 401;
            }
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Code = 500;
        resp.Message = 'Internal server error';
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.login = login;
//jwt verify
async function verifyJWT(token) {
    let resp = { Status: '', Message: '' };
    try {
        const publicKey = fs.readFileSync(__dirname.concat('/jwtRS256.key.pub'));
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        resp.Status = 'Success';
        resp.Code = 200;
        resp.Message = decoded;
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Code = 401;
        resp.Message = 'Invalid token';
    }
    finally {
        return resp;
    }
}
//validate function in the auth headers
async function verifyRequest(req) {
    let resp = { Status: 'Failed', Message: 'No token detected in header', Code: 403 };
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (typeof token === 'undefined') {
        resp.Status = 'Failed';
        resp.Code = 403;
        resp.Message = 'No auth header';
    }
    else {
        if (token.startsWith('Bearer ')) {
            //Remove Bearer from string
            token = token.slice(7, token.length);
        }
        if (token) {
            const verifyResult = await verifyJWT(token);
            resp.Status = verifyResult.Status;
            resp.Code = verifyResult.Code;
            resp.Message = verifyResult.Message;
        }
    }
    return resp;
}
exports.verifyRequest = verifyRequest;
//create random 4 digit temp token
async function createTempCode() {
    let resp = { Status: '', Message: '' };
    try {
        let tempString = '';
        let i;
        for (i = 0; i <= 8; i++) {
            tempString = tempString.concat((await getRandomNumberBetween(1, 9)).toString());
        }
        resp.Status = 'Success';
        resp.Message = Number(tempString);
    }
    catch (e) {
        resp.Status = 'Success';
        resp.Message = 1111111111;
        resp.Detail = e;
    }
    return resp;
    async function getRandomNumberBetween(min, max) {
        try {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        catch (e) {
            return 1;
        }
    }
}
async function insertTempCode(username) {
    let resp = { Status: '', Message: '' };
    const tempcode_result = await createTempCode();
    const tempcode = tempcode_result.Message;
    resp = await accountDBInterface.updateTempCode(username, tempcode);
    return resp;
}
async function getTempCode(username) {
    let resp = { Status: '', Message: '' };
    resp = await accountDBInterface.getTempCode(username);
    return resp;
}
async function removeTempCode(username) {
    let resp = { Status: '', Message: '' };
    resp = await accountDBInterface.deleteTempCode(username);
    return resp;
}
//change password mailer
async function mailerForChangingPassword(email, tempcode) {
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
            subject: 'Change Your Digitrans Questionnaire Platform Account Password',
            text: 'Enter this passcode on our web to continue changing your password: '.concat(tempcode.toString())
        };
        const mailerResult = await transporter.sendMail(mailOptions);
        resp.Status = 'Success';
        resp.Message = 'Passcode email has been sent';
        resp.Detail = mailerResult;
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = 'Email failed to be sent, please make the request again';
        resp.Detail = e;
    }
    return resp;
}
//get token to change password handler
async function requestChangePassword(username) {
    let resp = { Status: '', Message: '' };
    const tempcode_insert_result = await insertTempCode(username);
    if (tempcode_insert_result.Status == 'Success') {
        const tempcode_query_result = await getTempCode(username);
        const account_information = await accountDBInterface.readAccount(username);
        // get tempcode failed
        if (tempcode_query_result.Status == 'Failed') {
            resp = tempcode_query_result;
            resp.Code = 404;
        }
        else {
            const tempcode = tempcode_query_result.Message.tempcode;
            const email = account_information.Message.email;
            // account has not been verified
            if (!(account_information.Message.isverified)) {
                const deleteResult = await removeTempCode(username);
                resp.Status = 'Failed';
                resp.Message = 'Account has not been verified. '.concat(deleteResult.Message);
                resp.Code = 500;
            }
            else {
                const mail_result = await mailerForChangingPassword(email, tempcode);
                // mail failed
                if (mail_result.Status == 'Failed') {
                    resp = mail_result;
                    resp.Code = 500;
                }
                else {
                    resp = mail_result;
                    resp.Code = 200;
                }
            }
        }
    }
    else {
        resp = tempcode_insert_result;
        resp.Code = 500;
    }
    return resp;
}
exports.requestChangePassword = requestChangePassword;
//change password handler using generated token
async function changePassword(username, tempcode, newpassword) {
    let resp = { Status: '', Message: '' };
    const username_query_result = await accountDBInterface.readAccount(username);
    //username not found
    if (username_query_result.Status == 'Failed') {
        resp = username_query_result;
        resp.Code = 500;
    }
    else {
        const tempcode_query_result = await getTempCode(username);
        // get tempcode failed
        if (tempcode_query_result.Status == 'Failed') {
            resp = tempcode_query_result;
            resp.Code = 403;
        }
        else {
            //check if inserted tempcode equals to stored tempcode or not.
            if (tempcode_query_result.Message.tempcode != tempcode) {
                resp.Status = 'Failed';
                resp.Code = 403;
                resp.Message = 'Wrong code. Unable to change password';
            }
            else {
                const hashedPasswordResult = await hashPassword(newpassword);
                //hashing failed
                if (hashedPasswordResult.Status == 'Failed') {
                    resp = hashedPasswordResult;
                    resp.Code = 403;
                }
                else {
                    const change_password_result = await accountDBInterface.updatePassword(username, hashedPasswordResult.Message);
                    //update failed
                    if (change_password_result.Status == 'Failed') {
                        resp = change_password_result;
                        resp.Code = 500;
                    }
                    else {
                        const deleteResult = await removeTempCode(username);
                        resp = change_password_result;
                        resp.Message = resp.Message.concat('. ', deleteResult.Message);
                        resp.Code = 200;
                    }
                }
            }
        }
    }
    return resp;
}
exports.changePassword = changePassword;
