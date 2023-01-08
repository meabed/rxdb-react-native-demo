import { logger } from '../utils/logger';
import { restartPhone } from '../utils/phone';
import { initRxDB, rxDBInstance } from './rxdb-pouchdb';
import { cancelProductReplication, destroyProductReplication, runProductReplication } from './rxdb-pouchdb-product';
import { useEffect, useState } from 'react';

export async function createRxDBReplication() {
  logger.debug(`[RxDB-PouchDB] Create RxDBReplication started`);
  try {
    await initRxDB();
    logger.debug('[RxDB-PouchDB] Create RxDBReplication done');
  } catch (error) {
    logger.error('[RxDB-PouchDB] Create RxDBReplication error', error);
  }
}

export function useRxdbPouchdbStart() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const start = async () => {
      await createRxDBReplication();
      await runRxDBReplication();
    };
    start()
      .then((e) => {
        logger.debug('[RxDB-PouchDB] useRxDBStartAppReplication success');
        setIsReady(true);
      })
      .catch((e) => {
        logger.error('[RxDB-PouchDB] useRxDBStartAppReplication error', e);
        setIsReady(true);
      });
    return () => {};
  }, []);
  return { isReady };
}

export async function runRxDBReplication() {
  logger.debug('[RxDB-PouchDB] Run RxDBReplication started');
  try {
    runProductReplication().catch((error) => logger.error('[RxDB-PouchDB] Run Product Replication error', error));
    logger.debug('[RxDB-PouchDB] Run RxDBReplication done');
  } catch (error) {
    logger.error('[RxDB-PouchDB] Run RxDBReplication error', error);
  }
}

export async function cancelRxDBReplication() {
  logger.debug('[RxDB-PouchDB] Cancel RxDBReplication started');
  try {
    cancelProductReplication().catch((error) => logger.error('[RxDB-PouchDB] Cancel Product Replication error', error));
    logger.debug('[RxDB-PouchDB] Cancel RxDBReplication done');
  } catch (error) {
    logger.error('[RxDB-PouchDB] Cancel RxDBReplication error', error);
  }
}

export async function deleteRxDBReplication(params?: { reloadApp?: boolean }) {
  const { reloadApp = true } = params || {};

  try {
    await destroyProductReplication();
    await rxDBInstance?.remove();
  } catch (error) {
    logger.error('[RxDB-PouchDB] deleteRxDB error', error);
  }
  if (reloadApp) {
    await restartPhone();
  }
}
