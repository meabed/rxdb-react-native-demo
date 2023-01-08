import { deleteRxDBReplication, useRxdbPouchdbStart } from '../../rxdb/use-rxdb-pouchdb-start';
import { ProductList } from './components/product-list';
import React from 'react';
import { Button, Text, View } from 'react-native';

export function PouchdbScreen() {
  const { isReady } = useRxdbPouchdbStart();
  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>RxDB PouchDB</Text>
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
