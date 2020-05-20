import * as accountDBInterface from "../dbInterface/account" 
import { IResponse } from "../interfaces/interfaceCollection"
import * as bcrypt from "bcrypt"
const nodemailer = require('nodemailer')
import * as os from "os"
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
            resp = await mailer(email,'http://'.concat(url,'/',username))
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

async function mailer(email:string, url:string) : Promise<IResponse> {
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
    const networkInterfaces : any = os.networkInterfaces()
    const ipAddress : string = networkInterfaces.lo[0].address
    return ipAddress.concat(':3000/api/v1/account/verify')
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