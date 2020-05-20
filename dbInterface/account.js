"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = require("./dbConfig");
const database_1 = require("../errorHandler/database");
async function insertAccount(username, password, email, isverified) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'INSERT INTO account(username,password,email,isverified) VALUES ($1,$2,$3,$4)';
        const values = [username, password, email, isverified];
        const query_result = await dbConfig_1.db.query(text, values);
        resp.Status = 'Success';
        resp.Message = 'Record insert successful';
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.insertAccount = insertAccount;
async function readAccount(username) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'SELECT username,password,email,isverified FROM account WHERE username=$1';
        const values = [username];
        const query_result = await dbConfig_1.db.query(text, values);
        if (typeof query_result.rows[0] === 'undefined') {
            resp.Status = 'Failed';
            resp.Message = 'Username not found';
        }
        else {
            resp.Status = 'Success';
            resp.Message = query_result.rows[0];
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.readAccount = readAccount;
//updatePassword
async function updatePassword(username, password) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'UPDATE account SET password=$2 WHERE username=$1';
        const values = [username, password];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Password successfully updated';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Username not found';
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.updatePassword = updatePassword;
//updateVerification
async function updateVerification(username, isverified) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'UPDATE account SET isverified=$2 WHERE username=$1';
        const values = [username, isverified];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Account verification status changed to '.concat(isverified.toString());
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Username not found';
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.updateVerification = updateVerification;
//updateTempCode
async function updateTempCode(username, tempcode) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'UPDATE account SET tempcode=$2 WHERE username=$1';
        const values = [username, tempcode];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Tempcode successfully generated';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Username not found';
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.updateTempCode = updateTempCode;
//deleteTempCode
async function deleteTempCode(username) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'UPDATE account SET tempcode=0 WHERE username=$1';
        const values = [username];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Tempcode successfully deleted';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Username not found';
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.deleteTempCode = deleteTempCode;
async function deleteAccount(username) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'DELETE FROM account WHERE username=$1';
        const values = [username];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Account successfully deleted';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Username not found';
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.deleteAccount = deleteAccount;
//getTempCode
async function getTempCode(username) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'SELECT tempcode FROM account WHERE username=$1';
        const values = [username];
        const query_result = await dbConfig_1.db.query(text, values);
        if (typeof query_result.rows[0] === 'undefined') {
            resp.Status = 'Failed';
            resp.Message = 'Username not found';
        }
        else {
            if ((query_result.rows[0].tempcode == null) || (query_result.rows[0].tempcode == 0)) {
                resp.Status = 'Failed';
                resp.Message = 'Temp code is not available';
            }
            else {
                resp.Status = 'Success';
                resp.Message = query_result.rows[0];
            }
        }
    }
    catch (e) {
        resp.Status = 'Failed';
        resp.Message = await database_1.databaseError(e);
        resp.Detail = e;
    }
    finally {
        return resp;
    }
}
exports.getTempCode = getTempCode;
