import { db } from "./dbConfig"
import { databaseError } from "../errorHandler/database"
import { IResponse, IOpt, QuestionType } from "../interfaces/interfaceCollection"

export async function insertQuestion(questionnaire_id:number, question_type:QuestionType, description:string, opt:IOpt, required:boolean) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text:string = 'INSERT INTO question(questionnaire_id, type, description, opt, required) VALUES ($1,$2,$3,$4,$5)'
        const values:any = [questionnaire_id, question_type, description, opt, required]
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

export async function readQuestionByQuestionnaireId(questionnaire_id:number) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text : string = 'SELECT question_id, type, description, opt, required FROM question WHERE questionnaire_id = $1 ORDER BY question_id'
        const values : any = [questionnaire_id]
        const query_result : any = await db.query(text,values)
        if (typeof query_result.rows[0] === 'undefined'){
            resp.Status = 'Failed'
            resp.Message = 'Questions not yet created'
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

export async function updateQuestion(questionnaire_id:number,question_id:number, question_type:QuestionType, description:string, opt:IOpt, required:boolean) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text: string = 'UPDATE question SET type=$1, description=$2, opt=$3, required=$4 WHERE questionnaire_id=$5 AND question_id=$6'
        const values: any = [question_type,description,opt,required,questionnaire_id,question_id]
        const query_result: any = await db.query(text,values)
        if (query_result.rowCount != 0){
            resp.Status = 'Success'
            resp.Message = 'Question successfully updated'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Question not found'
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

export async function deleteQuestion(questionnaire_id:number, question_id:number) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text:string = 'DELETE FROM question WHERE questionnaire_id=$1 AND question_id=$2'
        const values:any = [questionnaire_id,question_id]
        const query_result = await db.query(text,values)
        if (query_result.rowCount != 0) {
            resp.Status = 'Success'
            resp.Message = 'Question successfully deleted'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Question not found'
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