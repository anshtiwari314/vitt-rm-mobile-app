import React,{createContext, useContext, useEffect, useRef, useState} from 'react'
import PushNotification from 'react-native-push-notification';
import {AppState} from 'react-native'
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
    const appStateRef = useRef<any>(AppState.currentState)
    const [appStateVisible,setAppStateVisible] = useState<any>(appStateRef.current)

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

    function showNotification2(data){
        console.log("showNotification2 is triggered",data)

        const key = Date.now().toString(); // Key must be unique everytime
        PushNotification.createChannel(
            {
                channelId: key, // (required)
                channelName: "Local messasge", // (required)
                channelDescription: "Notification for Local message", // (optional) default: undefined.
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.localNotification({
          /* Android Only Properties */
          channelId: key, // (required) channelId, if the channel doesn't exist, notification will not trigger.
          ticker: "My Notification Ticker", // (optional)
          showWhen: true, // (optional) default: true
          autoCancel: true, // (optional) default: true
          largeIcon: "", // (optional) default: "ic_launcher". Use "" for no large icon.
          largeIconUrl: undefined, // (optional) default: undefined
          smallIcon: "", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
          //bigText: "My big text that will be shown when notification is expanded. Styling can be done using HTML tags(see android docs for details)", // (optional) default: "message" prop
          //subText: "This is a subText", // (optional) default: none
          bigPictureUrl: undefined, // (optional) default: undefined
          bigLargeIcon: undefined, // (optional) default: undefined
          bigLargeIconUrl: undefined, // (optional) default: undefined
          color: "red", // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: "some_tag", // (optional) add tag to message
          group: "group", // (optional) add group to message
          groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          priority: "high", // (optional) set notification priority, default: high
          visibility: "private", // (optional) set notification visibility, default: private
          ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
          shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
          onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
          
          when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
          usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
          timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
        
          messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
        
          //actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
        
          /* iOS only properties */
          category: "", // (optional) default: empty string
          //subtitle: "My Notification Subtitle", // (optional) smaller title below notification title
        
          /* iOS and Android properties */
          id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          title: `new message from ${data.mob}`, // (optional)
          message: data.msg, // (required)
          picture: undefined, // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
          userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        });
    }

    // useEffect(()=>{
    //     showNotification2({mob:'8368751774',name:'anuj',message:'hello how are u today ?'})
    // },[])

    useEffect(()=>{
        if(rmId==='')
        return ;
        let awsUrl = 'https://f4zoadtc05.execute-api.ap-south-1.amazonaws.com/prod/rm-socket-backend/'
        let vittUrl = 'https://abwmrmchatapp.vitt.ai'
        let ngrokUrl = 'https://81c4-49-204-215-128.ngrok-free.app/'
        let flaskUrl = 'https://myflask-app-dot-amazing-hub-414413.el.r.appspot.com/'
        let localUrl = 'http://192.168.0.101:5001'
        let varunLocalIp = 'http://192.168.0.3:5000'
        
        const tempSocket = io(vittUrl)
        setSocket(tempSocket)
    },[rmId])

    useEffect(()=>{
        AppState.addEventListener('change',nextAppState=>{
            //console.log('AppState',appStateRef.current,'next state',nextAppState)
            appStateRef.current = nextAppState
            setAppStateVisible(appStateRef.current)
        })
    },[])

    useEffect(()=>{
        if(socket===null || rmId==='')
        return ;

        console.log('appstate',appStateVisible)
        socket.emit('rm_status_update_fromclient',{rm_id:rmId,status:appStateVisible})
        //showNotification2({mob:'8368751774',name:'anuj',message:appStateVisible})
    },[appStateVisible,socket,rmId])
    
    useEffect(()=>{
        
        if(socket===null || rmId==='')
        return ;
       // let rmId = '918708213235'
        function connect() {
            console.log('socket1 connected',socket.connected,socket.id,typeof(rmId),new Date().toLocaleString())
            socket.emit('rm_user_reconnect',{rm_id:rmId})
            if(isConnectedFirstTime.current===true){
                console.log('socket2 connected',socket.connected,socket.id,rmId,new Date().toLocaleString())
                let tempOb = {'list_of_connected_users':rmId}
                console.log('req_connected_users_time',new Date().toLocaleString())
                socket.emit('get_token_status_fromclient',{rm_id:rmId})
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
            console.log('response_list_of_connected_users_time',new Date().toLocaleString())
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
            
                    console.log('list of connected_users_time_after_updating_state',new Date().toLocaleString())
        }
        function onNotification(notification:any){
            console.log('onNotification',notification)
        }
        function getToken(token:any){
            console.log('token',token)
            socket.emit('update_token_status_fromclient',{rm_id:rmId,token:token.token})
        }
        function getTokenStatusFromServer(result){
            console.log("get token status from server",result.existed)
            let existed = result.existed 
            if(existed===false){
                // create a new token here 
                PushNotification.configure({
                    onRegister:getToken,
                    onNotification:onNotification,
                    
                })
            }else {
                PushNotification.configure({
                    onNotification:onNotification,
                })
            }
        }
        console.log(socket.connected,rmId)
        socket.on("connect", connect);
        socket.on('disconnect',disconnect)
          //socket.on('')
         // socket.on('connect_error',GetError)
         
        socket.on('rm_user_mapping_fromserver',rmUserMappingFromServer)
        
        // let intervalId = setInterval(()=>{
        //     console.log('frequent_trigger_fromclient',rmId,new Date().toLocaleString())
        //     socket.emit('frequent_trigger_fromclient',{rm_id:rmId})
        // },3000)
        
        
        socket.on('customermessage_fromserver',frequentTriggerFromServer)
        socket.on('triggernotification_fromserver',showNotification2)
        socket.on('get_token_status_fromserver',getTokenStatusFromServer)
          return ()=>{
                socket.off('connect',connect)
                socket.off('disconnect',disconnect)
                //socket.off('rm_user_mapping_fromServer',rmUserMappingFromServer)
                socket.off('customermessage_fromserver',frequentTriggerFromServer)
                socket.off('triggernotification_fromserver',showNotification2)
               // clearInterval(intervalId)
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