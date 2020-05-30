"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig_1 = require("./dbConfig");
const database_1 = require("../errorHandler/database");
async function insertQuestion(questionnaire_id, question_type, description, opt, required) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'INSERT INTO question(questionnaire_id, type, description, opt, required) VALUES ($1,$2,$3,$4,$5)';
        const values = [questionnaire_id, question_type, description, opt, required];
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
exports.insertQuestion = insertQuestion;
async function readQuestionByQuestionnaireId(questionnaire_id) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'SELECT question_id, type, description, opt, required FROM question WHERE questionnaire_id = $1 ORDER BY question_id';
        const values = [questionnaire_id];
        const query_result = await dbConfig_1.db.query(text, values);
        if (typeof query_result.rows[0] === 'undefined') {
            resp.Status = 'Failed';
            resp.Message = 'Questions not yet created';
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
exports.readQuestionByQuestionnaireId = readQuestionByQuestionnaireId;
async function updateQuestion(questionnaire_id, question_id, question_type, description, opt, required) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'UPDATE question SET type=$1, description=$2, opt=$3, required=$4 WHERE questionnaire_id=$5 AND question_id=$6';
        const values = [question_type, description, opt, required, questionnaire_id, question_id];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Question successfully updated';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Question not found';
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
exports.updateQuestion = updateQuestion;
async function deleteQuestion(questionnaire_id, question_id) {
    let resp = { Status: '', Message: '' };
    try {
        const text = 'DELETE FROM question WHERE questionnaire_id=$1 AND question_id=$2';
        const values = [questionnaire_id, question_id];
        const query_result = await dbConfig_1.db.query(text, values);
        if (query_result.rowCount != 0) {
            resp.Status = 'Success';
            resp.Message = 'Question successfully deleted';
        }
        else {
            resp.Status = 'Failed';
            resp.Message = 'Question not found';
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
exports.deleteQuestion = deleteQuestion;
