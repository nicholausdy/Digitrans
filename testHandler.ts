import * as accountHandler from "./handler/account"
import { IResponse } from "./interfaces/interfaceCollection"

async function main(){
    const username:string = 'nicdanyosss'
    const password:string = 'JackDullBoy1999'
    const email:string = 'nicdanyos@gmail.com'
    //const result1 : IResponse = await accountHandler.registerUser(username,password,email)
    //console.log(result1)
    const result2 : IResponse = await accountHandler.changeVerificationStatus(username)
    console.log(result2)
}

main()
