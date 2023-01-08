import { useRxdbPouchdbStart } from '../../rxdb/use-rxdb-pouchdb-start';
import React from 'react';
import { Text, View } from 'react-native';

export function HomeScreen() {
  const { isReady } = useRxdbPouchdbStart();
  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}
