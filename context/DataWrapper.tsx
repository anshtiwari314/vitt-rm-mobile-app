import React,{createContext, useContext, useEffect, useRef, useState} from 'react'
import { usersData } from '../Test/MOCK_DATA'
import { io } from "socket.io-client";

const Data = createContext('')

export function useData(){
   return useContext(Data)
}

let userFormat = {
    name:'',
    mobile:'',
    clientId:'',
    lastMsg:'',
    unreadMsgCount:0,
    lastMsgDate:{
        year:'',
        day:'',
        month:''
    }
    
}

let chatsFormat = {
    sender:'',
    time:'',
    date:'',
    msg:'',
    mobile:''
}
export default function DataWrapper({children}:{children:React.ReactElement}){
    
    const [users,setUsers] = useState<any>([])
    const usersArrRef = useRef<any>([])
    const [chats,setChats] = useState<any>([])
    const chatsArrRef = useRef<any>([])
    const [rmId,setRmId] = useState('')
    const [socket,setSocket] = useState<any>(null)
    const isConnectedFirstTime = useRef<any>(true)

    //const baseUrl = 'https://myflask-app-dot-amazing-hub-414413.el.r.appspot.com'
    const baseUrl = 'https://abwm.vitt.ai'

    function getUsersList(url:string){
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
        
                body:JSON.stringify({
                    list_of_connected_users:rmId
                }),
                //@ts-ignore
                cache:'default',}).then(res=>{
                   //console.log("res from audio server",res)
                   return res.json()
                }).then((result)=>{
                  
                  //setMsg((prev)=>[...prev,...result])
                  //console.log(result.message)
                 resolve(result.message)
                 //setUsers(result.message) 
                })
        })
        
    
    }

    function checkForNewMsg(url:string){
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
        
                body:JSON.stringify({
                    rm_id:rmId
                }),
                //@ts-ignore
                cache:'default',}).then(res=>{
                   //console.log("res from audio server",res)
                   return res.json()
                }).then((result)=>{
                  
                  //setMsg((prev)=>[...prev,...result])
                  console.log('result',result)
                 //setUsers(result.message)
                 resolve(result) 
                })
        })
        
    }

    

    useEffect(()=>{
        if(rmId==='')
        return ;
        let ngrokUrl = 'https://7afa-2409-40f2-2082-65a6-154-e732-6f39-c1e5.ngrok-free.app/'
        let flaskUrl = 'https://myflask-app-dot-amazing-hub-414413.el.r.appspot.com/'
        let localUrl = 'http://192.168.0.101:5001'
        const tempSocket = io(flaskUrl)
        setSocket(tempSocket)
    },[rmId])

    
    useEffect(()=>{
        
        if(socket===null || rmId==='')
        return ;
       // let rmId = '918708213235'
        function connect() {
            console.log('socket1 connected',socket.connected,socket.id,typeof(rmId),new Date().toLocaleString())
            if(isConnectedFirstTime.current===true){
                console.log('socket2 connected',socket.connected,socket.id,rmId,new Date().toLocaleString())
                let tempOb = {'list_of_connected_users':rmId}
                socket.emit('rm_user_mapping_fromclient',tempOb)
                isConnectedFirstTime.current = false
            
            }
          }
        
        function disconnect(){
            console.log("you are disconnected",socket.id)
        }
        function GetError(err){
            console.log(err,err.message)
            // console.log("err",err.description)
             console.log("err",err.context)
        }
        
        function rmUserMappingFromServer(result){
            console.log('rmUserMappingFromServer',result,new Date().toLocaleString())
            let tempArr:any = []

            result.message?.map((e:any,i:number)=>{
                let tempUser = Object.assign({}, userFormat)
                //console.log("tempUSER",tempUser,userFormat)
                tempUser.name = e.name 
                tempUser.clientId = e.clientid  
                tempUser.mobile = e.mobno   
                tempUser.lastMsg = e.last_msg.message   
                tempUser.lastMsgDate.day =e.last_msg.time_id.split(' ')[0].split('').slice(6,8).join('')
                tempUser.lastMsgDate.month =e.last_msg.time_id.split(' ')[0].split('').slice(4,6).join('')
                tempUser.lastMsgDate.year =e.last_msg.time_id.split(' ')[0].split('').slice(0,4).join('')
                tempArr.push(tempUser) 
            })

            //console.log(tempArr)
            usersArrRef.current = [...tempArr]
            setUsers(tempArr)
        }
        function frequentTriggerFromServer(result){
            
            if(result===null)
                    return ;
                    //find first element using mobno 
                    //console.log('new msg result',result)
                    //console.log(Object.keys(result))
        
                    //let tempUsersRef =  [...usersArrRef.current]
                    let keys = Object.keys(result)
                    console.log('chk for new msg',result)
                    keys.map((mob:string,i:number)=>{
                        let tempNewMsg =Object.keys(result[mob])
        
                        
                         // if chatsArrRef has values
                        // it means user has once visited second screen or (it is in 2nd screen)
                        if (chatsArrRef.current.length >0){
                            console.log("chatsArrRef before",chatsArrRef.current)
                            console.log("chatsArrRef mob",chatsArrRef.current[0].mobile,mob)
                            if(chatsArrRef.current[0].mobile ===mob){
                                
                                let date_times= Object.keys(result[mob])
                                console.log("date_times",date_times)

                                date_times.forEach((date_time)=>{
                                    let tempChat = {...chatsFormat}
                                    //mob1,mob2,mob3
                                    console.log('date_time_obj',result[mob][date_time].msg)
        
                                    tempChat.date = date_time.split(' ')[0]
                                    tempChat.time = date_time.split(' ')[1]
                                    tempChat.mobile = mob 
                                    tempChat.msg  = result[mob][date_time].msg
                                    tempChat.sender = 'user'
        
                                  
                                    chatsArrRef.current = [...chatsArrRef.current,tempChat]
                                })
                                         
                            }
                        }
        
                        let tempLastMsgOfUser = {mob:mob,msg:getLastMsg(result[mob])}                
                        //console.log('tempLastMsgOfUser',tempLastMsgOfUser)
                        // find this user in users
                        let tempUser = null
                        // updating unreadMsg
                        usersArrRef.current =usersArrRef.current.filter((e:any,i:number)=>{
                            //if user found not add it to new Array
                            if(e.mobile === mob){
                               
                                e.unreadMsgCount =e.unreadMsgCount+tempNewMsg.length
                                e.lastMsg = tempLastMsgOfUser.msg
                                tempUser = e
                                return false
                            }
                            else{
                                return true
                            }
                        })
        
                        
                         //if tempUser =null it means this user is new 
                        if(tempUser===null){
                            tempUser = {...userFormat}
                            let d = new Date()
        
                            console.log("tempUser",tempUser)
                            tempUser.clientId ='abcdefg'
                            tempUser.lastMsg = '(new user)'
                            tempUser.mobile = mob
                            tempUser.unreadMsgCount = tempNewMsg.length
                            tempUser.name = mob 
                            tempUser.lastMsgDate={
                                year:`${d.getFullYear()}`,
                                day:`${d.getDate()}`,
                                month:`${d.getMonth()+1}`
                            }
                            
                        }
                        usersArrRef.current = ([tempUser,...usersArrRef.current])
                       
                        //console.log(mob,chatsArrRef.current)
        
                        
                        
                    setUsers((p:any)=>[...usersArrRef.current])
                    setChats((p:any)=>[...chatsArrRef.current])
                    })
            
    
        }
        console.log(socket.connected,rmId)
        socket.on("connect", connect);
        socket.on('disconnect',disconnect)
          //socket.on('')
         // socket.on('connect_error',GetError)
         
        socket.on('rm_user_mapping_fromserver',rmUserMappingFromServer)
        
        let intervalId = setInterval(()=>{
            console.log('frequent_trigger_fromclient',rmId,new Date().toLocaleString())
            socket.emit('frequent_trigger_fromclient',{rm_id:rmId})
        },3000)
        
        
        socket.on('customermessage_fromserver',frequentTriggerFromServer)
          return ()=>{
                socket.off('connect',connect)
                socket.off('disconnect',disconnect)
                //socket.off('rm_user_mapping_fromServer',rmUserMappingFromServer)
                socket.off('customermessage_fromserver',frequentTriggerFromServer)
                clearInterval(intervalId)
          }
    },[rmId,socket])

    

    // useEffect(()=>{
    //     if(rmId==='')
    //     return ;

    //     console.log('i m useEffect')
    //     let url = `${baseUrl}/rm_user_mapping`
        
        
    //     let tempArr:any = []
        
        
    //     getUsersList(url).then((result:any)=>{
    //        //console.log('get all users',result)
           
    //         result?.map((e:any,i:number)=>{
    //             let tempUser = Object.assign({}, userFormat)
    //             //console.log("tempUSER",tempUser,userFormat)
    //             tempUser.name = e.name 
    //             tempUser.clientId = e.clientid  
    //             tempUser.mobile = e.mobno   
    //             tempUser.lastMsg = e.last_msg.message   
    //             tempUser.lastMsgDate.day =e.last_msg.time_id.split(' ')[0].split('').slice(6,8).join('')
    //             tempUser.lastMsgDate.month =e.last_msg.time_id.split(' ')[0].split('').slice(4,6).join('')
    //             tempUser.lastMsgDate.year =e.last_msg.time_id.split(' ')[0].split('').slice(0,4).join('')
    //             tempArr.push(tempUser) 
    //         })

    //         //console.log(tempArr)
    //         usersArrRef.current = [...tempArr]
    //         setUsers(tempArr)
    //     })
    //     // usersData.map((e,i)=>{
    //     //     let tempUser = Object.assign({}, userFormat)
    //     //     console.log("tempUSER",e.name)
    //     //     tempUser.name = e.name 
    //     //     tempUser.clientId = e.clientId  
    //     //     tempUser.mobile = e.mobile   
    //     //     tempUser.lastMsg = e.lastMsg
    //     //     tempUser.lastMsgDate.day =e.lastMsgDate.day
    //     //     tempUser.lastMsgDate.month =e.lastMsgDate.month
    //     //     tempUser.lastMsgDate.year =e.lastMsgDate.year
    //     //     tempUser.unreadMsgCount = e.unreadMsgCount
    //     //     tempArr.push(tempUser) 
    //     // })
    //     // usersArrRef.current = [...tempArr]
    //     // setUsers(tempArr)
    // },[rmId])

    
    // useEffect(()=>{
    //     console.log(users)
    // },[users])

    function getLastMsg(obj:any){
        let keys = Object.keys(obj)
        let values = Object.values(obj)
        //@ts-ignore
        return values[keys.length-1].msg
    }

    // useEffect(()=>{
    //     if(rmId ==='')
    //     return ;
    //     //chk for new messages 
    //     let url = `${baseUrl}/frequent_trigger`
    //     let tempChats = []
    //     //@ts-ignore
    //     function getNotifications(){
    //     checkForNewMsg(url).then((result:any)=>{
    //         console.log('new msg result',result)
    //         if(result===null)
    //         return ;
    //         //find first element using mobno 
    //         //console.log('new msg result',result)
    //         //console.log(Object.keys(result))

    //         //let tempUsersRef =  [...usersArrRef.current]
    //         let keys = Object.keys(result)
    //         console.log('chk for new msg',result)
    //         keys.map((mob:string,i:number)=>{
    //             let tempNewMsg =Object.keys(result[mob])

                
    //              // if chatsArrRef has values
    //             // it means user has once visited second screen or (it is in 2nd screen)
    //             if (chatsArrRef.current.length >0){

    //                 if(chatsArrRef.current[0].mobile ===mob){
                        
    //                     let date_times= Object.keys(result[mob])

    //                     date_times.forEach((date_time)=>{
    //                         let tempChat = {...chatsFormat}
    //                         //mob1,mob2,mob3
    //                         console.log('date_time_obj',result[mob][date_time].msg)

    //                         tempChat.date = date_time.split(' ')[0]
    //                         tempChat.time = date_time.split(' ')[1]
    //                         tempChat.mobile = mob 
    //                         tempChat.msg  = result[mob][date_time].msg
    //                         tempChat.sender = 'user'

                          
    //                         chatsArrRef.current = [...chatsArrRef.current,tempChat]
    //                     })
                                 
    //                 }
    //             }

    //             let tempLastMsgOfUser = {mob:mob,msg:getLastMsg(result[mob])}                
    //             //console.log('tempLastMsgOfUser',tempLastMsgOfUser)
    //             // find this user in users
    //             let tempUser = null
    //             // updating unreadMsg
    //             usersArrRef.current =usersArrRef.current.filter((e:any,i:number)=>{
    //                 //if user found not add it to new Array
    //                 if(e.mobile === mob){
                       
    //                     e.unreadMsgCount =e.unreadMsgCount+tempNewMsg.length
    //                     e.lastMsg = tempLastMsgOfUser.msg
    //                     tempUser = e
    //                     return false
    //                 }
    //                 else{
    //                     return true
    //                 }
    //             })

                
    //              //if tempUser =null it means this user is new 
    //             if(tempUser===null){
    //                 tempUser = {...userFormat}
    //                 let d = new Date()

    //                 console.log("tempUser",tempUser)
    //                 tempUser.clientId ='abcdefg'
    //                 tempUser.lastMsg = '(new user)'
    //                 tempUser.mobile = mob
    //                 tempUser.unreadMsgCount = tempNewMsg.length
    //                 tempUser.name = mob 
    //                 tempUser.lastMsgDate={
    //                     year:`${d.getFullYear()}`,
    //                     day:`${d.getDate()}`,
    //                     month:`${d.getMonth()+1}`
    //                 }
                    
    //             }
    //             usersArrRef.current = ([tempUser,...usersArrRef.current])
               
    //             //console.log(mob,chatsArrRef.current)

                
                
    //         setUsers((p:any)=>[...usersArrRef.current])
    //         setChats((p:any)=>[...chatsArrRef.current])
    //         })


    //         //console.log('usersArrRef',chatsArrRef.current)
            
    //         // result.map((e,i)=>{
    //         //     console.log(e,'hello')
    //         // })
    //     })

    // }
        
    //     let intervalId=setInterval(()=>{
    //        // getNotifications()
    //     },3000)
    //     return ()=>{
    //         clearInterval(intervalId)
    //     }

    // },[rmId])

    // useEffect(()=>{
    //     console.log(usersData)
    // },[])
    useEffect(()=>{
       // console.log("chats",chats)
    },[chats])
    const values = {
        users,setUsers,usersArrRef,
        chats,setChats,
        baseUrl,chatsFormat,chatsArrRef,rmId,setRmId,
        getUsersList,userFormat,socket
    }
    return (
        //@ts-ignore
        <Data.Provider value={values}>
            {children}
        </Data.Provider>
    )
}