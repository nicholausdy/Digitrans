import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import * as accountHandler from "./handler/account"
import * as questionnaireHandler from "./handler/questionnaire"
import { IResponse } from "./interfaces/interfaceCollection"
import { serverError } from "./errorHandler/server"
import { read } from "fs"

const app : any = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));

//v1/account
app.post('/api/v1/account/login', async(req:any,res:any) => {
    try {
        const loginResult : IResponse = await accountHandler.login(req.body.username,req.body.password)
        res.status(loginResult.Code)
        res.json(loginResult)
    }
    catch (e) {
        const errorResult : IResponse = await serverError(e)
        res.status(errorResult.Code)
        res.json(errorResult)
    }
});

//register user
app.post('/api/v1/account/register', async(req:any,res:any) => {
    try {
        const registerResult : IResponse = await accountHandler.registerUser(req.body.username,req.body.password,req.body.email)
        res.status(registerResult.Code)
        res.json(registerResult)
    }
    catch (e) {
        const errorResult : IResponse = await serverError(e)
        res.status(errorResult.Code)
        res.json(errorResult)
    }
});

app.get('/api/v1/account/verify/:username/:token', async(req:any,res:any) => {
    try{
        const verifyResult : IResponse = await accountHandler.changeVerificationStatus(req.params.username,req.params.token)
        res.status(verifyResult.Code)
        res.json(verifyResult)
    }
    catch (e) {
        const errorResult : IResponse = await serverError(e)
        res.status(errorResult.Code)
        res.json(errorResult)
    }
});

app.get('/api/v1/account/requestPasswordChange/:username', async(req:any,res:any) => {
    try {
        const requestResult : IResponse = await accountHandler.requestChangePassword(req.params.username)
        res.status(requestResult.Code)
        res.json(requestResult)
    }
    catch (e) {
        const errorResult : IResponse = await serverError(e)
        res.status(errorResult.Code)
        res.json(errorResult)
    }
});

app.put('/api/v1/account/changePassword', async(req:any,res:any) => {
    try {
        const changeResult : IResponse = await accountHandler.changePassword(req.body.username,req.body.tempcode,req.body.newpassword)
        res.status(changeResult.Code)
        res.json(changeResult)
    }
    catch (e) {
        const errorResult : IResponse = await serverError(e)
        res.status(errorResult.Code)
        res.json(errorResult)
    }
});

//questionnaire
app.post('/api/v1/questionnaire/:username/createQuestionnaire', async(req:any,res:any) => {
    try {
        const verifyUser : IResponse = await accountHandler.verifyRequest(req)
        console.log(verifyUser)
        if (verifyUser.Status == 'Success'){
            const createResult : IResponse = await questionnaireHandler.createQuestionnaire(req.body.questionnaire_name,req.params.username)
            res.status(createResult.Code)
            res.json(createResult)
        } 
        else {
            res.status(verifyUser.Code)
            res.json(verifyUser)
        }  
    }
    catch (e) {
        const errorResult : IResponse = await serverError(e)
        res.status(errorResult.Code)
        res.json(errorResult)
    }
})

app.get('/api/v1/questionnaire/:username/getQuestionnaire/:questionnaireid', async(req:any,res:any)=> {
    try {
        const verifyUser : IResponse = await accountHandler.verifyRequest(req)
        console.log(verifyUser)
        if (verifyUser.Status == 'Success'){
            const readResult : IResponse = await questionnaireHandler.getOneQuestionnaire(req.params.questionnaireid)
            if (readResult.Message.username != req.params.username){
                const forbiddenResult : IResponse = {Status:'Failed',Message:'User '.concat(req.params.username,' attempted to access resources owned by other user'),Code:403}
                res.status(forbiddenResult.Code)
                res.json(forbiddenResult)
            }
            else {
                res.status(readResult.Code)
                res.json(readResult)
            }
        }
        else {
            res.status(verifyUser.Code)
            res.json(verifyUser)
        }
   }
   catch (e) {
       const errorResult : IResponse = await serverError(e)
       res.status(errorResult.Code)
       res.json(errorResult)
   }
})

app.get('/api/v1/questionnaire/:username/getQuestionnaire', async(req:any, res:any) => {
    try {
        const verifyUser : IResponse = await accountHandler.verifyRequest(req)
        console.log(verifyUser)
        if (verifyUser.Status == 'Success'){
            const readResult : IResponse = await questionnaireHandler.getQuestionnairesByUsername(req.params.username)
            res.status(readResult.Code)
            res.json(readResult)
        }
        else {
            res.status(verifyUser.Code)
            res.json(verifyUser)
        }
   }
   catch (e) {
       const errorResult : IResponse = await serverError(e)
       res.status(errorResult.Code)
       res.json(errorResult)
   }
})

app.put('/api/v1/questionnaire/:username/updateQuestionnaire/:questionnaireid', async(req:any,res:any)=> {
    try {
        const verifyUser : IResponse = await accountHandler.verifyRequest(req)
        console.log(verifyUser)
        if (verifyUser.Status == 'Success'){
            const readResult : IResponse = await questionnaireHandler.getOneQuestionnaire(req.params.questionnaireid)
            if (readResult.Status != 'Success'){
                res.status(readResult.Code)
                res.json(readResult)
            }
            else {
                if (readResult.Message.username != req.params.username){
                    const forbiddenResult : IResponse = {Status:'Failed',Message:'User '.concat(req.params.username,' attempted to access resources owned by other user'),Code:403}
                    res.status(forbiddenResult.Code)
                    res.json(forbiddenResult)
                }
                else {
                    const updateResult : IResponse = await questionnaireHandler.updateQuestionnaire(req.params.questionnaireid,req.body.questionnaire_name)
                    res.status(updateResult.Code)
                    res.json(updateResult)
                }
            }
        }
        else {
            res.status(verifyUser.Code)
            res.json(verifyUser)
        }
   }
   catch (e) {
       const errorResult : IResponse = await serverError(e)
       res.status(errorResult.Code)
       res.json(errorResult)
   }
})

app.delete('/api/v1/questionnaire/:username/deleteQuestionnaire/:questionnaireid', async(req:any,res:any)=> {
    try {
        const verifyUser : IResponse = await accountHandler.verifyRequest(req)
        console.log(verifyUser)
        if (verifyUser.Status == 'Success'){
            const readResult : IResponse = await questionnaireHandler.getOneQuestionnaire(req.params.questionnaireid)
            if (readResult.Status != 'Success'){
                res.status(readResult.Code)
                res.json(readResult)
            }
            else {
                if (readResult.Message.username != req.params.username){
                    const forbiddenResult : IResponse = {Status:'Failed',Message:'User '.concat(req.params.username,' attempted to access resources owned by other user'),Code:403}
                    res.status(forbiddenResult.Code)
                    res.json(forbiddenResult)
                }
                else {
                    const deleteResult : IResponse = await questionnaireHandler.deleteQuestionnaire(req.params.questionnaireid)
                    res.status(deleteResult.Code)
                    res.json(deleteResult)
                }
            }
        }
        else {
            res.status(verifyUser.Code)
            res.json(verifyUser)
        }
   }
   catch (e) {
       const errorResult : IResponse = await serverError(e)
       res.status(errorResult.Code)
       res.json(errorResult)
   }
})

//run server
app.listen(3000, () => {
    console.log('Maid cafe serving at port 3000')
})


