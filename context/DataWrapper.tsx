import React,{createContext, useContext, useEffect, useRef, useState} from 'react'

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

    const baseUrl = 'https://myflask-app-dot-amazing-hub-414413.el.r.appspot.com'
    
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
                  //console.log(result)
                 //setUsers(result.message)
                 resolve(result) 
                })
        })
        
    }

    
    useEffect(()=>{
        if(rmId==='')
        return ;

        console.log('i m useEffect')
        let url = `${baseUrl}/rm_user_mapping`
        
        
        let tempArr:any = []
        
        
        getUsersList(url).then((result:any)=>{
           console.log('get all users',result)
           
            result?.map((e:any,i:number)=>{
                let tempUser = {...userFormat}
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
        })
        
        
    },[rmId])

    // useEffect(()=>{
    //     console.log(users)
    // },[users])

    useEffect(()=>{
        if(rmId ==='')
        return ;
        //chk for new messages 
        let url = `${baseUrl}/frequent_trigger`
        let tempChats = []
        //@ts-ignore
        function getNotifications(){
        checkForNewMsg(url).then((result:any)=>{
            if(result===null)
            return ;
            //find first element using mobno 
          //console.log('new msg result',result)
            //console.log(Object.keys(result))

            //let tempUsersRef =  [...usersArrRef.current]
            let keys = Object.keys(result)
            //console.log('chk for new msg',result)
            keys.map((mob:string,i:number)=>{
                let tempNewMsg =Object.keys(result[mob])
                // find this user in users 
                // updating unreadMsg
                usersArrRef.current.map((e:any,i:number)=>{
                    if(e.mobile === mob){
                        e.unreadMsgCount =e.unreadMsgCount+tempNewMsg.length
                        
                    }
                })
                 
                // if chatsArrRef has values 
                // it means user has once visited second screen or (it is in 2nd screen)
                //console.log(mob,chatsArrRef.current)
                if (chatsArrRef.current.length >0){
                    // 
                    //console.log('chatsArrRef',chatsArrRef.current[0],'mob',mob)
                    if(chatsArrRef.current[0].mobile ===mob){

                        let date_times= Object.keys(result[mob])

                        date_times.forEach((date_time)=>{
                            let tempChat = {...chatsFormat}
                            //mob1,mob2,mob3
    
                            tempChat.date = date_time.split(' ')[0]
                            tempChat.time = date_time.split(' ')[1]
                            tempChat.mobile = mob 
                            tempChat.msg  = result[mob][date_time].msg
                            tempChat.sender = 'user'

                            chatsArrRef.current = [...chatsArrRef.current,tempChat]
                        })
                                 
                    }

                }
                
            })


            console.log('usersArrRef',chatsArrRef.current)
            setUsers((p:any)=>[...usersArrRef.current])
            setChats((p:any)=>[...chatsArrRef.current])
            // result.map((e,i)=>{
            //     console.log(e,'hello')
            // })
        })

    }
        
        let intervalId=setInterval(()=>{
            getNotifications()
        },3000)
        return ()=>{
            clearInterval(intervalId)
        }

    },[rmId])

    const values = {
        users,setUsers,usersArrRef,
        chats,setChats,
        baseUrl,chatsFormat,chatsArrRef,rmId,setRmId,
        getUsersList,userFormat
    }
    return (
        //@ts-ignore
        <Data.Provider value={values}>
            {children}
        </Data.Provider>
    )
}