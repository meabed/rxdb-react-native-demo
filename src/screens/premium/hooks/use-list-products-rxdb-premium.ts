import { Product, RxDBProduct } from '../../../rxdb/common';
import { runProductReplication } from '../../../rxdb/rxdb-premium-product';
import { useEffect, useState } from 'react';
import { MangoQuery } from 'rxdb';

export function useListProductsRxdbPremium(props?: MangoQuery<RxDBProduct>) {
  const [stateDocs, setStateDocs] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let collSub;
    const asyncFunc = async () => {
      const rp = await runProductReplication();
      collSub = rp?.collection?.find(props ?? {}).$.subscribe((docs) => {
        setStateDocs([...docs.map((e) => e.data)]);
        setIsReady(true);
      });
    };
    asyncFunc().then();
    return () => {
      collSub?.unsubscribe();
      setIsReady(false);
    };
  }, [JSON.stringify(props)]);

  return [
    {
      productList: stateDocs,
      isReady,
    },
  ];
}
