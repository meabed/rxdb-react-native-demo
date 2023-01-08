import { logger } from '../utils/logger';
import { restartPhone } from '../utils/phone';
import { initRxDB, rxDBInstance } from './rxdb-premium';
import { cancelProductReplication, destroyProductReplication, runProductReplication } from './rxdb-premium-product';
import { useEffect, useState } from 'react';

export async function createRxDBReplication() {
  logger.debug(`[RxDB-Premium] Create RxDBReplication started`);
  try {
    await initRxDB();
    logger.debug('[RxDB-Premium] Create RxDBReplication done');
  } catch (error) {
    logger.error('[RxDB-Premium] Create RxDBReplication error', error);
  }
}

export function useRxdbPremiumStart() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const start = async () => {
      await createRxDBReplication();
      await runRxDBReplication();
    };
    start()
      .then((e) => {
        logger.debug('[RxDB-Premium] useRxDBStartAppReplication success');
        setIsReady(true);
      })
      .catch((e) => {
        logger.error('[RxDB-Premium] useRxDBStartAppReplication error', e);
        setIsReady(true);
      });
    return () => {};
  }, []);
  return { isReady };
}

export async function runRxDBReplication() {
  logger.debug('[RxDB-Premium] Run RxDBReplication started');
  try {
    runProductReplication().catch((error) => logger.error('[RxDB-Premium] Run Product Replication error', error));
    logger.debug('[RxDB-Premium] Run RxDBReplication done');
  } catch (error) {
    logger.error('[RxDB-Premium] Run RxDBReplication error', error);
  }
}

export async function cancelRxDBReplication() {
  logger.debug('[RxDB-Premium] Cancel RxDBReplication started');
  try {
    cancelProductReplication().catch((error) => logger.error('[RxDB-Premium] Cancel Product Replication error', error));
    logger.debug('[RxDB-Premium] Cancel RxDBReplication done');
  } catch (error) {
    logger.error('[RxDB-Premium] Cancel RxDBReplication error', error);
  }
}

export async function deleteRxDBReplication(params?: { reloadApp?: boolean }) {
  const { reloadApp = true } = params || {};

  try {
    await destroyProductReplication();
    await rxDBInstance?.remove();
  } catch (error) {
    logger.error('[RxDB-Premium] deleteRxDB error', error);
  }
  if (reloadApp) {
    await restartPhone();
  }
}
