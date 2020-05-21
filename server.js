"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const accountHandler = __importStar(require("./handler/account"));
const server_1 = require("./errorHandler/server");
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json({ limit: '5mb' }));
//v1/account
app.post('/api/v1/account/login', async (req, res) => {
    try {
        const loginResult = await accountHandler.login(req.body.username, req.body.password);
        res.status(loginResult.Code);
        res.json(loginResult);
    }
    catch (e) {
        const errorResult = await server_1.serverError(e);
        res.status(errorResult.Code);
        res.json(errorResult);
    }
});
//register user
app.post('/api/v1/account/register', async (req, res) => {
    try {
        const registerResult = await accountHandler.registerUser(req.body.username, req.body.password, req.body.email);
        res.status(registerResult.Code);
        res.json(registerResult);
    }
    catch (e) {
        const errorResult = await server_1.serverError(e);
        res.status(errorResult.Code);
        res.json(errorResult);
    }
});
app.get('/api/v1/account/verify/:username/:token', async (req, res) => {
    try {
        const verifyResult = await accountHandler.changeVerificationStatus(req.params.username, req.params.token);
        res.status(verifyResult.Code);
        res.json(verifyResult);
    }
    catch (e) {
        const errorResult = await server_1.serverError(e);
        res.status(errorResult.Code);
        res.json(errorResult);
    }
});
app.get('/api/v1/account/requestPasswordChange/:username', async (req, res) => {
    try {
        const requestResult = await accountHandler.requestChangePassword(req.params.username);
        res.status(requestResult.Code);
        res.json(requestResult);
    }
    catch (e) {
        const errorResult = await server_1.serverError(e);
        res.status(errorResult.Code);
        res.json(errorResult);
    }
});
app.put('/api/v1/account/changePassword', async (req, res) => {
    try {
        const changeResult = await accountHandler.changePassword(req.body.username, req.body.tempcode, req.body.newpassword);
        res.status(changeResult.Code);
        res.json(changeResult);
    }
    catch (e) {
        const errorResult = await server_1.serverError(e);
        res.status(errorResult.Code);
        res.json(errorResult);
    }
});
//run server
app.listen(3000, () => {
    console.log('Maid cafe serving at port 3000');
});
