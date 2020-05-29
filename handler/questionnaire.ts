import * as questionnaireDBInterface from "../dbInterface/questionnaire"
import { IResponse } from "../interfaces/interfaceCollection"
import { createTempCode } from "./account"

export async function createQuestionnaire(questionnaire_name:string, username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    const code_result : IResponse = await createTempCode()
    const questionnaire_id : number = code_result.Message
    resp = await questionnaireDBInterface.insertQuestionnaire(questionnaire_id, questionnaire_name, username)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}

export async function getOneQuestionnaire(questionnaire_id:number) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    resp = await questionnaireDBInterface.readOneQuestionnaire(questionnaire_id)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}

export async function getQuestionnairesByUsername(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    resp = await questionnaireDBInterface.readQuestionnairesByUsername(username)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}

export async function updateQuestionnaire(questionnaire_id:number,questionnaire_name:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    resp = await questionnaireDBInterface.updateQuestionnaire(questionnaire_id,questionnaire_name)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}

export async function deleteQuestionnaire(questionnaire_id:number) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    resp = await questionnaireDBInterface.deleteQuestionnaire(questionnaire_id)
    if (resp.Status == 'Success'){
        resp.Code = 200
    }
    else {
        resp.Code = 500
    }
    return resp
}