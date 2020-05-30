"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const question = __importStar(require("./dbInterface/question"));
async function main() {
    //const username:string = 'test3'
    const password = 'test1.2';
    const email = 'test4@gmail.com';
    const isverified = true;
    const tempcode = 12345;
    //const result1:IResponse = await account.insertAccount(username,password,email,isverified)
    //console.log(result1)
    //const result2:IResponse = await account.readAccount(username)
    //console.log(result2)
    //const result3:IResponse = await account.updatePassword(username,password)
    //console.log(result3)
    //const result4:IResponse = await account.updateVerification(username,isverified)
    //console.log(result4)
    //const result5:IResponse = await account.updateTempCode(username,tempcode)
    //console.log(result5)
    //const result6:IResponse = await account.deleteTempCode(username)
    //console.log(result6)
    //const result7:IResponse = await account.getTempCode(username)
    //console.log(result7)
    //const result8 : IResponse = await account.deleteAccount(username)
    //console.log(result8)
    const questionnaire_id = 141956352;
    const questionnaire_name = 'Tester 4';
    const username = '18217028';
    const question_type = 'radio';
    const description = 'Universitas yang diambil?';
    const opt = { opt1: "ITB", opt2: "UI", opt3: "UPH" };
    const required = true;
    //const result9 : IResponse = await questionnaire.insertQuestionnaire(questionnaire_id, questionnaire_name, username)
    //console.log(result9)
    //const result10 : IResponse = await questionnaire.readAllQuestionnaires()
    //console.log(result10)
    //const result11 : IResponse = await questionnaire.readOneQuestionnaire(questionnaire_id)
    //console.log(result11)
    //const result12 : IResponse = await questionnaire.readQuestionnairesByUsername(username)
    //console.log(result12)
    //const result13 : IResponse = await questionnaire.updateQuestionnaire(questionnaire_id,questionnaire_name)
    //console.log(result13)
    //const result14 : IResponse = await questionnaire.deleteQuestionnaire(questionnaire_id)
    //console.log(result14)
    const result15 = await question.insertQuestion(questionnaire_id, question_type, description, opt, required);
    console.log(result15);
}
main();
