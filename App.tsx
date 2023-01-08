import { PouchdbScreen } from './src/screens/pouchdb/pouchdb-screen';
import { PremiumScreen } from './src/screens/premium/premium-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='PouchDB' component={PouchdbScreen} />
        <Tab.Screen name='Premium' component={PremiumScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
