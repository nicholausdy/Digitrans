"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = require("./dbConfig");
const database_1 = require("../errorHandler/database");
async function insertQuestionnaire(questionnaire_id, questionnaire_name, username) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'INSERT INTO questionnaire(questionnaire_id, questionnaire_name, username) VALUES ($1,$2,$3)';
        const values = [questionnaire_id, questionnaire_name, username];
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
exports.insertQuestionnaire = insertQuestionnaire;
async function readAllQuestionnaires() {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'SELECT questionnaire_id, questionnaire_name, username FROM questionnaire';
        const query_result = await dbConfig_1.db.query(text);
        if (typeof query_result.rows[0] === 'undefined') {
            resp.Status = 'Failed';
            resp.Message = 'Record empty';
        }
        else {
            resp.Status = 'Success';
            resp.Message = query_result.rows;
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
exports.readAllQuestionnaires = readAllQuestionnaires;
async function readOneQuestionnaire(questionnaire_id) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'SELECT questionnaire_id, questionnaire_name, username FROM questionnaire WHERE questionnaire_id = $1';
        const values = [questionnaire_id];
        const query_result = await dbConfig_1.db.query(text, values);
        if (typeof query_result.rows[0] === 'undefined') {
            resp.Status = 'Failed';
            resp.Message = 'Questionnaire not found';
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
exports.readOneQuestionnaire = readOneQuestionnaire;
async function readQuestionnairesByUsername(username) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'SELECT questionnaire_id, questionnaire_name FROM questionnaire WHERE username = $1';
        const values = [username];
        const query_result = await dbConfig_1.db.query(text, values);
        if (typeof query_result.rows[0] === 'undefined') {
            resp.Status = 'Failed';
            resp.Message = 'Questionnaire for specified username is empty';
        }
        else {
            resp.Status = 'Success';
            resp.Message = query_result.rows;
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
exports.readQuestionnairesByUsername = readQuestionnairesByUsername;
async function updateQuestionnaire(questionnaire_id, questionnaire_name) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'UPDATE questionnaire SET questionnaire_name=$2 WHERE questionnaire_id=$1';
        const values = [questionnaire_id, questionnaire_name];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Questionnaire title successfully updated';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Questionnaire not found';
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
exports.updateQuestionnaire = updateQuestionnaire;
async function deleteQuestionnaire(questionnaire_id) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'DELETE FROM questionnaire WHERE questionnaire_id=$1';
        const values = [questionnaire_id];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Questionnaire successfully deleted';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Questionnaire not found';
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
exports.deleteQuestionnaire = deleteQuestionnaire;
