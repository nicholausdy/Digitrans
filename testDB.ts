import * as account from "./dbInterface/account"
import { IResponse } from "./interfaces/interfaceCollection"

async function main(){
    const username:string = 'test3'
    const password:string = 'test1.2'
    const email:string = 'test4@gmail.com'
    const isverified:boolean = true
    const tempcode:number = 12345
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
    const result8 : IResponse = await account.deleteAccount(username)
    console.log(result8)
}

main()