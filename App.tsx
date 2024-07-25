
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import ChatScreen from './screens/ChatScreen';
import UsersScreen from './screens/UsersScreen'
import LoginScreen from './screens/LoginScreen';

import DataWrapper from './context/DataWrapper';
import Screens  from './screens/Screens';
import { createStackNavigator } from '@react-navigation/stack';

export default function App(){

  // useEffect(()=>{
  //   console.log("i am app",PushNotification)
  // },[])
  const Stack = createStackNavigator()
  

  
  return(
    <DataWrapper>
    <NavigationContainer>
        {/* <Stack.Navigator> */}
                {/* <Stack.Screen
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
                  /> */}
                <Screens/>
        {/* </Stack.Navigator> */}
    </NavigationContainer>
    </DataWrapper>
  )
}

//3,8,10
//75,171,227