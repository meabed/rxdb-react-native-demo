import { useRxdbPremiumStart } from '../../rxdb/use-rxdb-premium-start';
import React from 'react';
import { Text, View } from 'react-native';

export function PremiumScreen() {
  const { isReady } = useRxdbPremiumStart();
  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>RxDB Premium</Text>
    </View>
  );
}
