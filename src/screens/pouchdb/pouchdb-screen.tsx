import { deleteRxDBReplication, useRxdbPouchdbStart } from '../../rxdb/use-rxdb-pouchdb-start';
import { ProductList } from './components/product-list';
import React from 'react';
import { Alert, Button, Text, View } from 'react-native';

export function PouchdbScreen() {
  const { isReady } = useRxdbPouchdbStart();
  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>RxDB PouchDB</Text>
      <Button
        title={'Delete RxDB PouchDB Database'}
        onPress={async () => {
          Alert.alert(
            'Delete RxDB PouchDB Database',
            'Are you sure you want to delete the RxDB PouchDB database?',
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
