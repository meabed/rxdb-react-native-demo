import { useRxdbPremiumStart } from '../../rxdb/use-rxdb-premium-start';
import React from 'react';
import { Text, View } from 'react-native';

export function SettingsScreen() {
  const { isReady } = useRxdbPremiumStart();
  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}
