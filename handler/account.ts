import * as accountDBInterface from "../dbInterface/account" 
import { IResponse } from "../interfaces/interfaceCollection"
import * as bcrypt from "bcrypt"
const nodemailer = require('nodemailer')
import * as jwt from "jsonwebtoken"
import * as fs from "fs"
require('dotenv').config();

async function hashPassword(password:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const saltRounds:number = 10;
        const hashedPassword:string = await bcrypt.hash(password, saltRounds)
        resp.Status = 'Success'
        resp.Message = hashedPassword
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = 'Hashing failed'
        resp.Detail = e
    }
    finally {
        return resp
    }
}

async function comparePassword(plainTextPassword:string, hashedPassword:string) : Promise<IResponse>{
    let resp : IResponse = {Status:'', Message:''}
    try {
        const isMatched:boolean = await bcrypt.compare(plainTextPassword, hashedPassword)
        resp.Status = 'Success'
        resp.Message = isMatched
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = 'Hashing comparison failed'
        resp.Detail = e
    }
    finally {
        return resp
    }
}

export async function registerUser(username:string, password: string, email:string){
    let resp : IResponse = {Status:'', Message:''}
    const hashResult : IResponse = await hashPassword(password)
    if (hashResult.Status == 'Success'){
        resp = await accountDBInterface.insertAccount(username, hashResult.Message, email, false)
        if (resp.Status == 'Success') {
            const url:string = await getURL()
            resp = await mailerForVerification(email, url.concat('/account/verify','/',username))
            if (resp.Status == 'Success'){
                resp.Code = 200
            }
            // mailer failed
            else {
                resp.Code = 500
                const deleteResult = accountDBInterface.deleteAccount(username)
                console.log(deleteResult)
            }
        }
        // insertion failed
        else {
            resp.Code = 500
            if (resp.Message == 'Primary key already exists'){
                resp.Message = 'Username already exists'
            }
        }
    }
    // hashing failed
    else {
        resp = hashResult
        resp.Code = 500
    }
    return resp
}

async function mailerForVerification(email:string, url:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const transporter:any = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions:any = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Digitrans Questionnaire Platform Account',
            text: 'Thank you for registering your account for the first time.\nClick this link to verify your account: '.concat(url)
        };

        const mailerResult = await transporter.sendMail(mailOptions)
        resp.Status = 'Success'
        resp.Message = 'Verification email has been sent'
        resp.Detail = mailerResult
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = 'Email failed to be sent, please re-register'
        resp.Detail = e
    }
    return resp
}

async function getURL() : Promise<string> {
    let resp : string = ''
    const hostURL  = process.env.HOST_URL
    if (typeof hostURL === 'undefined'){
        resp = 'Problems encountered. Please contact the administrator' 
    }
    else {
        resp = hostURL.concat('/api/v1')
    }
    return resp
}

//verify account
export async function changeVerificationStatus(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    resp = await accountDBInterface.updateVerification(username,true)
    if (resp.Status == 'Success'){
        resp.Code = 200
        resp.Message = 'Account has been verified'
    }
    else {
        resp.Code = 500
    }
    return resp
}

//validate username and password
async function validateCredentials(username : string,password : string) : Promise<IResponse>{
    let resp : IResponse = {Status:'', Message:''}
    const passwordSearchResult = await accountDBInterface.readAccount(username)
    if (passwordSearchResult.Status == 'Failed') {
        resp = passwordSearchResult
        resp.Code = 500
        return resp
    }    
    else {
        const compare : IResponse = await comparePassword(password, passwordSearchResult.Message.password)
        //hashing function failed
        if (compare.Status == 'Failed'){
            compare.Code = 500
        }
        else {
            compare.Code = 200
        }
        return compare
    }
}
//login -- check if username found, password right, and account has been verified / not
export async function login(username : string, password : string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const isCredentialValid : IResponse = await validateCredentials(username,password)
        //generate token only when username and password are validated + account is verified
        if ((isCredentialValid.Status == 'Success') && (isCredentialValid.Message)){
            const verification_result : IResponse = await accountDBInterface.readAccount(username)
            if (!(verification_result.Message.isverified)){
                resp.Status = 'Failed'
                resp.Message = 'Account has not been verified'
                resp.Code = 500
            }
            else {
                const privateKey : Buffer = fs.readFileSync(__dirname.concat('/jwtRS256.key'))
                const passphrase : any = process.env.JWT_PASSPHRASE
                const token : string = jwt.sign({username:username}, {key: privateKey, passphrase: passphrase }, {algorithm:"RS256", expiresIn: '24h'});
                resp.Status = 'Success'
                resp.Detail = token
                resp.Message = 'User authentication successful'
                resp.Code = isCredentialValid.Code
            }       
        }
        else {
            if (isCredentialValid.Status == 'Failed'){
                resp.Status = 'Failed'
                resp.Message = isCredentialValid.Message
                resp.Code = 401
            }
            if (!(isCredentialValid.Message)){
                resp.Status = 'Failed'
                resp.Message = 'Wrong password'
                resp.Code = 401
            }
        }
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Code = 500
        resp.Message = 'Internal server error'
        resp.Detail = e
    }
    finally {
        return resp
    }
}
//jwt verify
async function verifyJWT(token:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const publicKey : Buffer = fs.readFileSync(__dirname.concat('/jwtRS256.key.pub'))
        const decoded : any =  jwt.verify(token, publicKey, {algorithms: ["RS256"]})
        resp.Status = 'Success'
        resp.Code = 200
        resp.Message = decoded
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Code = 401
        resp.Message = 'Invalid token'
    }
    finally {
        return resp
    }
}

//validate function in the auth headers
export async function verifyRequest(req:any) : Promise<IResponse>{
    let resp : IResponse = {Status:'Failed',Message:'No token detected in header', Code: 403}
    let token : string | undefined =  req.headers['x-access-token'] || req.headers['authorization'];
    if (typeof token === 'undefined'){
        resp.Status = 'Failed'
        resp.Code = 403
        resp.Message = 'No auth header'
    }
    else {
        if (token.startsWith('Bearer ')){
            //Remove Bearer from string
            token = token.slice(7, token.length)
        }
        if (token){
            const verifyResult : IResponse = await verifyJWT(token) 
            resp.Status = verifyResult.Status
            resp.Code = verifyResult.Code
            resp.Message = verifyResult.Message
        }
    }
    return resp
}

//create random 4 digit temp token
async function createTempCode(): Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        let tempString : string = ''
        let i:number
        for (i=0; i<=8; i++){
            tempString = tempString.concat((await getRandomNumberBetween(1,9)).toString())
        }
        resp.Status = 'Success'
        resp.Message = Number(tempString)
    }
    catch (e) {
        resp.Status = 'Success'
        resp.Message = 1111111111
        resp.Detail = e
    }
    return resp

    async function getRandomNumberBetween(min:number, max:number): Promise<number>{
        try {
            return Math.floor(Math.random()*(max-min+1)+min);
        }
        catch (e) {
            return 1
        }
    }
}

async function insertTempCode(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    const tempcode_result : IResponse = await createTempCode()
    const tempcode : number = tempcode_result.Message
    resp = await accountDBInterface.updateTempCode(username, tempcode)
    return resp
}

async function getTempCode(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    resp = await accountDBInterface.getTempCode(username)
    return resp
}
async function removeTempCode(username:string) : Promise<IResponse> {
    let resp: IResponse = {Status:'', Message:''}
    resp = await accountDBInterface.deleteTempCode(username)
    return resp
}

//change password mailer
async function mailerForChangingPassword(email:string, tempcode:number) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const transporter:any = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions:any = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Change Your Digitrans Questionnaire Platform Account Password',
            text: 'Enter this passcode on our web to continue changing your password: '.concat(tempcode.toString())
        };

        const mailerResult = await transporter.sendMail(mailOptions)
        resp.Status = 'Success'
        resp.Message = 'Passcode email has been sent'
        resp.Detail = mailerResult
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = 'Email failed to be sent, please make the request again'
        resp.Detail = e
    }
    return resp
}

//get token to change password handler
export async function requestChangePassword(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    const tempcode_insert_result : IResponse = await insertTempCode(username)
    if (tempcode_insert_result.Status == 'Success'){
        const tempcode_query_result : IResponse = await getTempCode(username)
        const account_information : IResponse = await accountDBInterface.readAccount(username)
        // get tempcode failed
        if (tempcode_query_result.Status == 'Failed'){
            resp = tempcode_query_result
            resp.Code = 404
        }
        else {
            const tempcode : number = tempcode_query_result.Message.tempcode
            const email : string = account_information.Message.email
            // account has not been verified
            if (!(account_information.Message.isverified)){
                const deleteResult : IResponse = await removeTempCode(username)
                resp.Status = 'Failed'
                resp.Message = 'Account has not been verified. '.concat(deleteResult.Message)
                resp.Code = 500
            }
            else {
                const mail_result : IResponse = await mailerForChangingPassword(email,tempcode)
                // mail failed
                if (mail_result.Status == 'Failed'){
                    resp = mail_result
                    resp.Code = 500
                }
                else {
                    resp = mail_result
                    resp.Code = 200
                }
            }
        }
    }
    //insertion failed
    else {
        resp = tempcode_insert_result
        resp.Code = 500
    }
    return resp       
}

//change password handler using generated token
export async function changePassword (username: string, tempcode:number, newpassword: string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    const username_query_result = await accountDBInterface.readAccount(username)
    //username not found
    if (username_query_result.Status == 'Failed'){
        resp = username_query_result
        resp.Code = 500
    }
    else {
        const tempcode_query_result = await getTempCode(username)
        // get tempcode failed
        if (tempcode_query_result.Status == 'Failed'){
            resp = tempcode_query_result
            resp.Code = 403
        }
        else {
            //check if inserted tempcode equals to stored tempcode or not.
            if (tempcode_query_result.Message.tempcode != tempcode) {
                resp.Status = 'Failed'
                resp.Code = 403
                resp.Message = 'Wrong code. Unable to change password'
            }
            else {
                const hashedPasswordResult : IResponse = await hashPassword(newpassword)
                //hashing failed
                if (hashedPasswordResult.Status == 'Failed'){
                    resp = hashedPasswordResult
                    resp.Code = 403
                }
                else {
                    const change_password_result : IResponse = await accountDBInterface.updatePassword(username,hashedPasswordResult.Message)
                    //update failed
                    if (change_password_result.Status == 'Failed'){
                        resp = change_password_result
                        resp.Code = 500
                    }
                    else {
                        const deleteResult : IResponse = await removeTempCode(username)
                        resp = change_password_result
                        resp.Message = resp.Message.concat('. ',deleteResult.Message)
                        resp.Code = 200
                        
                    }
                }
            }

        }
    }
    return resp
}
