import { deleteRxDBReplication, useRxdbPremiumStart } from '../../rxdb/use-rxdb-premium-start';
import { ProductList } from './components/product-list';
import React from 'react';
import { Button, Text, View } from 'react-native';

export function PremiumScreen() {
  const { isReady } = useRxdbPremiumStart();
  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>RxDB Premium</Text>
      <Button
        title={'Delete Database'}
        onPress={async () => {
          await deleteRxDBReplication();
        }}
      />
      <ProductList />
    </View>
  );
}
