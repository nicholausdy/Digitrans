import { db } from "./dbConfig"
import { databaseError } from "../errorHandler/database"
import { IResponse } from "../interfaces/interfaceCollection"


export async function insertAccount(username:string, password:string, email:string, isverified:boolean) : Promise<IResponse>{
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text:string = 'INSERT INTO account(username,password,email,isverified) VALUES ($1,$2,$3,$4)'
        const values:any = [username,password,email,isverified]
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

export async function readAccount(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text:string = 'SELECT username,password,email,isverified FROM account WHERE username=$1'
        const values:any = [username]
        const query_result:any = await db.query(text,values)
        if (typeof query_result.rows[0] === 'undefined'){
            resp.Status = 'Failed'
            resp.Message = 'Username not found'
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

//updatePassword
export async function updatePassword(username: string, password: string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text: string = 'UPDATE account SET password=$2 WHERE username=$1'
        const values: any = [username,password]
        const query_result: any = await db.query(text,values)
        if (query_result.rowCount != 0){
            resp.Status = 'Success'
            resp.Message = 'Password successfully updated'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Username not found'
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
//updateVerification
export async function updateVerification(username:string, isverified: boolean) : Promise<IResponse> {
    let resp : IResponse = {Status:'',Message:''}
    try {
        const text:string = 'UPDATE account SET isverified=$2 WHERE username=$1'
        const values:any = [username,isverified]
        const query_result:any = await db.query(text,values)
        if (query_result.rowCount != 0) {
            resp.Status = 'Success'
            resp.Message = 'Account verification status changed to '.concat(isverified.toString())
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Username not found'
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

//updateTempCode
export async function updateTempCode(username:string, tempcode:number) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text:string = 'UPDATE account SET tempcode=$2 WHERE username=$1'
        const values:any = [username,tempcode]
        const query_result = await db.query(text,values)
        if (query_result.rowCount != 0) {
            resp.Status = 'Success'
            resp.Message = 'Tempcode successfully generated'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Username not found'
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

//deleteTempCode
export async function deleteTempCode(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text:string = 'UPDATE account SET tempcode=0 WHERE username=$1'
        const values:any = [username]
        const query_result = await db.query(text,values)
        if (query_result.rowCount != 0) {
            resp.Status = 'Success'
            resp.Message = 'Tempcode successfully deleted'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Username not found'
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

export async function deleteAccount(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text:string = 'DELETE FROM account WHERE username=$1'
        const values:any = [username]
        const query_result = await db.query(text,values)
        if (query_result.rowCount != 0) {
            resp.Status = 'Success'
            resp.Message = 'Account successfully deleted'
        }
        else {
            resp.Status = 'Failed'
            resp.Message = 'Username not found'
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
//getTempCode
export async function getTempCode(username:string) : Promise<IResponse> {
    let resp : IResponse = {Status:'', Message:''}
    try {
        const text:string = 'SELECT tempcode FROM account WHERE username=$1'
        const values:any = [username]
        const query_result = await db.query(text,values)
        if (typeof query_result.rows[0] === 'undefined'){
            resp.Status = 'Failed'
            resp.Message = 'Username not found'
        }
        else {
            if ((query_result.rows[0].tempcode == null) || (query_result.rows[0].tempcode == 0)){
                resp.Status = 'Failed'
                resp.Message = 'Temp code is not available'
            }
            else {
                resp.Status = 'Success'
                resp.Message = query_result.rows[0]
            }
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
