import { logger } from '../utils/logger';
import { RxDBProduct, RxDBProductCheckpoint, retryTimes } from './common';
import { dbName, rxDBInstance } from './rxdb-pouchdb';
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
      logger.debug('[RxDB-PouchDB] Cannot create product replication, dbName or product collection is not available');
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
          const lastId = lastCheckpoint ? lastCheckpoint.uuid : undefined;
          try {
            logger.debug(`[RxDB-PouchDB] Pulling product from API with lastId: ${lastId}`);
            const { data } = await axios.get(`https://dummyjson.com/products?limit=10&skip=${lastId ?? 0}`);
            const documentsFromRemote: RxDBProduct[] =
              data?.products?.map((e) => {
                const uuid = e.id.toString();
                return {
                  uuid: uuid,
                  _deleted: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  data: { ...e, uuid },
                } as RxDocumentData<RxDBProduct>;
              }) ?? [];
            return {
              documents: documentsFromRemote,
              hasMoreDocuments: documentsFromRemote.length === batchSize,
              checkpoint:
                documentsFromRemote.length === 0
                  ? lastCheckpoint
                  : {
                      uuid: lastOfArray(documentsFromRemote).uuid,
                      updatedAt: lastOfArray(documentsFromRemote).updatedAt,
                    },
            };
          } catch (error) {
            logger.error(`[RxDB-PouchDB] Error pulling product from API: ${error}`);
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
    logger.error(`[RxDB-PouchDB] Error creating Product replication: ${e}`);
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
