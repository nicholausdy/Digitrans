import * as account from "./dbInterface/account"
import * as questionnaire from "./dbInterface/questionnaire"
import { IResponse } from "./interfaces/interfaceCollection"

async function main(){
    //const username:string = 'test3'
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
    //const result8 : IResponse = await account.deleteAccount(username)
    //console.log(result8)
    const questionnaire_id : number = 37373737
    const questionnaire_name : string = 'Tester 4'
    const username : string = '18217028'
    //const result9 : IResponse = await questionnaire.insertQuestionnaire(questionnaire_id, questionnaire_name, username)
    //console.log(result9)
    //const result10 : IResponse = await questionnaire.readAllQuestionnaires()
    //console.log(result10)
    //const result11 : IResponse = await questionnaire.readOneQuestionnaire(questionnaire_id)
    //console.log(result11)
    //const result12 : IResponse = await questionnaire.readQuestionnairesByUsername(username)
    //console.log(result12)
    const result13 : IResponse = await questionnaire.updateQuestionnaire(questionnaire_id,questionnaire_name)
    console.log(result13)
    //const result14 : IResponse = await questionnaire.deleteQuestionnaire(questionnaire_id)
    //console.log(result14)
}

main()