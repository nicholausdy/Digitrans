"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const questionnaireDBInterface = __importStar(require("../dbInterface/questionnaire"));
const account_1 = require("./account");
async function createQuestionnaire(questionnaire_name, username) {
    let resp = { Status: '', Message: '' };
    const code_result = await account_1.createTempCode();
    const questionnaire_id = code_result.Message;
    resp = await questionnaireDBInterface.insertQuestionnaire(questionnaire_id, questionnaire_name, username);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.createQuestionnaire = createQuestionnaire;
async function getOneQuestionnaire(questionnaire_id) {
    let resp = { Status: '', Message: '' };
    resp = await questionnaireDBInterface.readOneQuestionnaire(questionnaire_id);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.getOneQuestionnaire = getOneQuestionnaire;
async function getQuestionnairesByUsername(username) {
    let resp = { Status: '', Message: '' };
    resp = await questionnaireDBInterface.readQuestionnairesByUsername(username);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.getQuestionnairesByUsername = getQuestionnairesByUsername;
async function updateQuestionnaire(questionnaire_id, questionnaire_name) {
    let resp = { Status: '', Message: '' };
    resp = await questionnaireDBInterface.updateQuestionnaire(questionnaire_id, questionnaire_name);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.updateQuestionnaire = updateQuestionnaire;
async function deleteQuestionnaire(questionnaire_id) {
    let resp = { Status: '', Message: '' };
    resp = await questionnaireDBInterface.deleteQuestionnaire(questionnaire_id);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.deleteQuestionnaire = deleteQuestionnaire;
