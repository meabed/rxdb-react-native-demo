import { PouchdbScreen } from './src/screens/pouchdb/pouchdb-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='PouchDB' component={PouchdbScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
