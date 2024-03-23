
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './screens/ChatScreen';
import UsersScreen from './screens/UsersScreen'
import DataWrapper from './context/DataWrapper';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator()

export default function App(){

  return(
    <DataWrapper>
    <NavigationContainer>
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
    </NavigationContainer>
    </DataWrapper>
  )
}
