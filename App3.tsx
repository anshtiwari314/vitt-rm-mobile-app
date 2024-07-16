import React, {useRef, useState, useEffect} from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';

export default function AppStateExample () {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {

      console.log('AppState', appState.current,'next state',nextAppState);
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log('Appstate visible',appStateVisible)
  },[appStateVisible])
  return (
    <View>
      <Text>Current state is: {appStateVisible}</Text>
    </View>
    )
}