"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const questionDBInterface = __importStar(require("../dbInterface/question"));
async function createQuestion(questionnaire_id, question_type, description, opt, required) {
    let resp = { Status: '', Message: '' };
    if (question_type == 'textarea') {
        opt = {};
    }
    resp = await questionDBInterface.insertQuestion(questionnaire_id, question_type, description, opt, required);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.createQuestion = createQuestion;
async function getQuestionsByQuestionnaireId(questionnaire_id) {
    let resp = { Status: '', Message: '' };
    resp = await questionDBInterface.readQuestionByQuestionnaireId(questionnaire_id);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.getQuestionsByQuestionnaireId = getQuestionsByQuestionnaireId;
async function updateQuestion(questionnaire_id, question_id, question_type, description, opt, required) {
    let resp = { Status: '', Message: '' };
    if (question_type == 'textarea') {
        opt = {};
    }
    resp = await questionDBInterface.updateQuestion(questionnaire_id, question_id, question_type, description, opt, required);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.updateQuestion = updateQuestion;
async function removeQuestion(questionnaire_id, question_id) {
    let resp = { Status: '', Message: '' };
    resp = await questionDBInterface.deleteQuestion(questionnaire_id, question_id);
    if (resp.Status == 'Success') {
        resp.Code = 200;
    }
    else {
        resp.Code = 500;
    }
    return resp;
}
exports.removeQuestion = removeQuestion;
