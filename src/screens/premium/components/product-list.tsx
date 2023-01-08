import { useListProductsRxdbPremium } from '../hooks/use-list-products-rxdb-premium';
import { ScrollView, Text, View } from 'react-native';

export function ProductList() {
  const [{ isReady, productList }] = useListProductsRxdbPremium({
    selector: {
      // example IN Query
      // sid: { $in: ['1', '100'] }
    },
    limit: 200,
    sort: [{ createdAt: 'desc' }],
  });
  if (!isReady) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ScrollView>
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        RxDB Premium Product List
      </Text>
      {productList?.map((p) => {
        return (
          <View key={p.sid}>
            <Text>
              {p.sid} :: {p.title}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
