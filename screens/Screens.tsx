import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import ChatScreen from './ChatScreen';
import LoginScreen from './LoginScreen';
import UsersScreen from './UsersScreen';
import { useData } from '../context/DataWrapper';

export default function Screens(){
    const Stack = createStackNavigator()
    //@ts-ignore
    const {rmId} = useData()
    useEffect(()=>{
      console.log("screens rm id",rmId)
    },[rmId])
    if(rmId===null || rmId===''){
        return (
          <Stack.Navigator>
          <Stack.Screen
              name='Login'
              component={LoginScreen}
              options={{
                headerShown:false
              }}
            />
          <Stack.Screen
              name='Users'
              component={UsersScreen}
              options={{
                headerShown:false
              }}
            />
          <Stack.Screen
              name='Chats'
              component={ChatScreen}
            />
          
      </Stack.Navigator>
            
        )
    }else {
        return (
            
            <Stack.Navigator>
            <Stack.Screen
                name='Users'
                component={UsersScreen}
                options={{
                  headerShown:false
                }}
              />
            <Stack.Screen
                name='Chats'
                component={ChatScreen}
              />
            
        </Stack.Navigator>
        )
    }
        
}