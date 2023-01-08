import { logger } from '../utils/logger';
import { RxDBProduct, RxDBProductCheckpoint, retryTimes } from './common';
import { dbName, rxDBInstance } from './rxdb-premium';
import axios from 'axios';
import { lastOfArray } from 'rxdb';
import { RxDocumentData } from 'rxdb/dist/types/types';
import { RxReplicationState, replicateRxCollection } from 'rxdb/plugins/replication';

let productReplication: RxReplicationState<RxDBProduct, RxDBProductCheckpoint> | undefined;

export async function createProductReplication() {
  if (productReplication) {
    return productReplication;
  }

  try {
    if (!dbName || !rxDBInstance?.collections?.product) {
      logger.debug('[RxDB-Premium] Cannot create product replication, dbName or product collection is not available');
      return;
    }
    const replicationIdentifier = `${dbName}-product-api-replication`;
    productReplication = replicateRxCollection<RxDBProduct, RxDBProductCheckpoint>({
      collection: rxDBInstance?.collections?.product,
      replicationIdentifier,
      live: true,
      retryTime: retryTimes.product,
      waitForLeadership: false,
      autoStart: true,
      pull: {
        batchSize: 25,
        async handler(lastCheckpoint, batchSize) {
          const lastId = lastCheckpoint ? lastCheckpoint.sid : undefined;
          try {
            logger.debug(`[RxDB-Premium] Pulling product from API with lastId: ${lastId}`);
            const { data } = await axios.get(`https://dummyjson.com/products?limit=${batchSize}&skip=${lastId ?? 0}`);
            const documentsFromRemote: RxDBProduct[] =
              data?.products?.map((e) => {
                const sid = e.id.toString();
                return {
                  sid: sid,
                  _deleted: false,
                  createdAt: (new Date().getTime() + e.id * 1000).toString(),
                  updatedAt: (new Date().getTime() + e.id * 1000).toString(),
                  data: { ...e, sid },
                } as RxDocumentData<RxDBProduct>;
              }) ?? [];
            return {
              documents: documentsFromRemote,
              hasMoreDocuments: documentsFromRemote.length === batchSize,
              checkpoint:
                documentsFromRemote.length === 0
                  ? lastCheckpoint
                  : {
                      sid: lastOfArray(documentsFromRemote).sid,
                      updatedAt: lastOfArray(documentsFromRemote).updatedAt,
                    },
            };
          } catch (error) {
            logger.error(`[RxDB-Premium] Error pulling product from API: ${error}`);
            throw error;
          }
        },
      },
      push: {
        batchSize: 1,
        async handler(docs) {
          // not implemented
          return [];
        },
      },
    });
  } catch (e) {
    productReplication = undefined;
    logger.error(`[RxDB-Premium] Error creating Product replication: ${e}`);
  }
  return productReplication;
}

let interval: NodeJS.Timeout | undefined;

export async function runProductReplication() {
  const rp = await createProductReplication();
  if (!interval) {
    interval = setInterval(async () => {
      rp?.reSync();
    }, retryTimes.product);
  }
  return rp;
}

export async function cancelProductReplication() {
  await productReplication?.cancel();
  clearInterval(interval);
  interval = undefined;
  productReplication = undefined;
  return true;
}

export async function destroyProductReplication() {
  clearInterval(interval);
  interval = undefined;
  await productReplication?.collection.remove();
  productReplication = undefined;
  return true;
}
