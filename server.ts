import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import * as accountHandler from "./handler/account"
import { IResponse } from "./interfaces/interfaceCollection"
import { serverError } from "./errorHandler/server"

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

app.get('/api/v1/account/verify/:username', async(req:any,res:any) => {
    try{
        const verifyResult : IResponse = await accountHandler.changeVerificationStatus(req.params.username)
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

//run server
app.listen(3000, () => {
    console.log('Maid cafe serving at port 3000')
})


