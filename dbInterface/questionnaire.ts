import { db } from "./dbConfig"
import { databaseError } from "../errorHandler/database"
import { IResponse } from "../interfaces/interfaceCollection"

export async function insertQuestionnaire(questionnaire_id:number, questionnaire_name:string, username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text:string = 'INSERT INTO questionnaire(questionnaire_id, questionnaire_name, username) VALUES ($1,$2,$3)'
        const values:any = [questionnaire_id, questionnaire_name, username]
        const query_result:any = await db.query(text,values)
        resp.Status = 'Success'
        resp.Message = 'Record insert successful'
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = await databaseError(e)
        resp.Detail = e 
    }
    finally {
        return resp
    }
}

export async function readAllQuestionnaires() : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text : string = 'SELECT questionnaire_id, questionnaire_name, username FROM questionnaire' 
        const query_result : any = await db.query(text)
        if (typeof query_result.rows[0] === 'undefined'){
            resp.Status = 'Failed'
            resp.Message = 'Record empty'
        }
        else {
            resp.Status = 'Success'
            resp.Message = query_result.rows
        }
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = await databaseError(e)
        resp.Detail = e
    }
    finally {
        return resp
    }
}

export async function readOneQuestionnaire(questionnaire_id : number) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text : string = 'SELECT questionnaire_id, questionnaire_name, username FROM questionnaire WHERE questionnaire_id = $1'
        const values : any = [questionnaire_id]
        const query_result : any = await db.query(text,values)
        if (typeof query_result.rows[0] === 'undefined'){
            resp.Status = 'Failed'
            resp.Message = 'Questionnaire not found'
        } 
        else {
            resp.Status = 'Success'
            resp.Message = query_result.rows[0]
        }
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = await databaseError(e)
        resp.Detail = e
    }
    finally {
        return resp
    }
}

export async function readQuestionnairesByUsername(username : string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text : string = 'SELECT questionnaire_id, questionnaire_name FROM questionnaire WHERE username = $1'
        const values : any = [username]
        const query_result : any = await db.query(text,values)
        if (typeof query_result.rows[0] === 'undefined'){
            resp.Status = 'Failed'
            resp.Message = 'Questionnaire for specified username is empty'
        } 
        else {
            resp.Status = 'Success'
            resp.Message = query_result.rows
        }
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = await databaseError(e)
        resp.Detail = e
    }
    finally {
        return resp
    }
}

export async function updateQuestionnaire(questionnaire_id : number, questionnaire_name : string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text: string = 'UPDATE questionnaire SET questionnaire_name=$2 WHERE questionnaire_id=$1'
        const values: any = [questionnaire_id, questionnaire_name]
        const query_result: any = await db.query(text,values)
        if (query_result.rowCount != 0){
            resp.Status = 'Success'
            resp.Message = 'Questionnaire title successfully updated'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Questionnaire not found'
        }
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = await databaseError(e)
        resp.Detail = e
    }
    finally {
        return resp
    }  
} 

export async function deleteQuestionnaire(questionnaire_id : number) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text:string = 'DELETE FROM questionnaire WHERE questionnaire_id=$1'
        const values:any = [questionnaire_id]
        const query_result = await db.query(text,values)
        if (query_result.rowCount != 0) {
            resp.Status = 'Success'
            resp.Message = 'Questionnaire successfully deleted'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Questionnaire not found'
        }
    }
    catch (e) {
        resp.Status = 'Failed'
        resp.Message = await databaseError(e)
        resp.Detail = e
    }
    finally {
        return resp
    }
}