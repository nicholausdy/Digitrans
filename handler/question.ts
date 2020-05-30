import * as questionDBInterface from "../dbInterface/question"
import { IResponse, QuestionType } from "../interfaces/interfaceCollection"

export async function createQuestion(questionnaire_id:number, question_type:QuestionType, description:string, opt:any, required:boolean) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    if (question_type == 'textarea'){
        opt = {}
    }
    resp = await questionDBInterface.insertQuestion(questionnaire_id, question_type, description, opt, required)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}

export async function getQuestionsByQuestionnaireId(questionnaire_id:number){
    let resp : IResponse = {Status:'',Message:''}
    resp = await questionDBInterface.readQuestionByQuestionnaireId(questionnaire_id)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}

export async function updateQuestion(questionnaire_id:number,question_id:number, question_type:QuestionType, description:string, opt:any, required:boolean) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    if (question_type == 'textarea'){
        opt = {}
    }
    resp = await questionDBInterface.updateQuestion(questionnaire_id,question_id, question_type, description, opt, required)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}

export async function removeQuestion(questionnaire_id:number, question_id:number) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    resp = await questionDBInterface.deleteQuestion(questionnaire_id, question_id)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}
