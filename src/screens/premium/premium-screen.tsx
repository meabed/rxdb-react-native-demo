import { deleteRxDBReplication, useRxdbPremiumStart } from '../../rxdb/use-rxdb-premium-start';
import { ProductList } from './components/product-list';
import React from 'react';
import { Alert, Button, Text, View } from 'react-native';

export function PremiumScreen() {
  const { isReady } = useRxdbPremiumStart();
  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        RxDB Premium
      </Text>
      <Button
        title={'Delete RxDB Premium Database'}
        onPress={async () => {
          Alert.alert(
            'Delete RxDB Premium Database',
            'Are you sure you want to delete the RxDB Premium database?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: async () => {
                  await deleteRxDBReplication();
                },
              },
            ],
            { cancelable: false }
          );
        }}
      />
      <ProductList />
    </View>
  );
}
