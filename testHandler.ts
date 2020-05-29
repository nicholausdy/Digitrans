import * as accountHandler from "./handler/account"
import { IResponse } from "./interfaces/interfaceCollection"

async function main(){
    const username:string = 'nicdanyos'
    const password:string = 'swordbeach'
    const email:string = 'nicdanyos@gmail.com'
    const token:string = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY2hvbGF1cyIsImlhdCI6MTU5MDczNTE0NSwiZXhwIjoxNTkwODIxNTQ1fQ.ZuiJed8miYC8V3GHz-2VGvx8fDNcw2vgVISXwHSbuL4OM7KdylOZwjvMNOc7_7s4RIQ9Pf-ilwkQtB-FFoI30eu8yoEugCNI-rkqvd2JTYWJsNm35kpOMeURDE5jdbkEPlzvBdKGTYbofPNR0aWhStpXYHOCunCCH62h80WBVd1QZ3IrUqNj0VggbmKaGnoYIj-C2fujZn5rPyuGnASFkB0AgKsWtt8xr5Yz4utEPNB1OqBUDuICxM3HoxzywyKQjH6nyL-rT5Wz1fI6IYomrJ2RdFVYK6LW9hjzkKebtlzwVLO3d9B3dDjV-Kt4qLf8Nb95ef24PSzFUSbZdi4tyzulthPanvj0BwcfIjUcPPKcAydXHle48VwWhLbVfy3cY8EydVDGnwxtujZcgePwmzxZZYxM-96bfhv2LrsXmbrCIpEf6H4vsGnmTwYrfOvRZSR13LMArnp_zb5i3Fz4Rew5XehGpA57C7dmLyhdyvvBv2AN-LE70jQhMHQannRmL9Xv-Los04UdICqwTdLg9xsWEMZTkdYssq_iMhNowLxFkSoztQ7Sabc3XxTGhtaJFu0ktB38KLzDz-rQPnEbCIicvfq0Ct5V6Lde7UWCClFMVhUkLdxqlBYb4v8MnsaCUFRGUTLwGp5d35Ni7eXz-9_QBWon0rWbnzFKJppkz18'
    const req:any = {headers: {'authorization':token},body :{'username':'nicholaus'}}
    const tempcode:number = 438733524
    const newpassword:string = 'swordbeach'
    //const result1 : IResponse = await accountHandler.registerUser(username,password,email)
    //console.log(result1)
    //const result2 : IResponse = await accountHandler.changeVerificationStatus(username)
    //console.log(result2)
    //const result3 : IResponse = await accountHandler.validateCredentials(username,password)
    //console.log(result3)
    //const result4 : IResponse = await accountHandler.login(username,password)
    //console.log(result4)
    //const result5 : IResponse = await accountHandler.verifyJWT(token)
    //console.log(result5)
    const result6 : IResponse = await accountHandler.verifyRequest(req)
    console.log(result6)
    //const result7 : IResponse = await accountHandler.createTempToken()
    //console.log(result7)
    //const result8 : IResponse = await accountHandler.insertTempCode(username)
    //console.log(result8)
    //const result9 : IResponse = await accountHandler.removeTempCode(username)
    //console.log(result9)
    //const result10 : IResponse = await accountHandler.mailerForChangingPassword(email,11111)
    //console.log(result10)
    //const result11 : IResponse = await accountHandler.requestChangePassword(username)
    //console.log(result11)
    //const result12 : IResponse = await accountHandler.changePassword(username,tempcode,newpassword)
    //console.log(result12)
}

main()
