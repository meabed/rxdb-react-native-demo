import 'react-native-get-random-values';
import 'fast-text-encoding';

import { logger } from '../utils/logger';
import { rxdbCollections } from './common';
import { open } from 'react-native-quick-sqlite';
import { RxDatabase, addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb';
import { getRxStorageSQLite, getSQLiteBasicsQuickSQLite } from 'rxdb-premium/plugins/sqlite';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);
//
if (__DEV__) {
  addRxPlugin(RxDBDevModePlugin);
}
export let rxDBInstance: RxDatabase;
const rxStoragePouch = getRxStorageSQLite({
  sqliteBasics: getSQLiteBasicsQuickSQLite(open),
});

export let dbName = `premium-demo-db-v0`;

export async function initRxDB() {
  if (rxDBInstance) {
    return rxDBInstance;
  }
  try {
    logger.debug(`[initRxDB] dbName: ${dbName}`);
    rxDBInstance = await createRxDatabase({
      name: dbName,
      storage: rxStoragePouch,
      localDocuments: true,
      multiInstance: false,
      ignoreDuplicate: true,
      allowSlowCount: true,
    });
    logger.debug('[RxDB-Premium] rxDBInstance created');
    try {
      await rxDBInstance.addCollections(rxdbCollections);
    } catch (error) {
      logger.error('[RxDB-Premium] error creating collections', error);
    }
    logger.debug('[RxDB-Premium] initRxDB success');
    return rxDBInstance;
  } catch (error) {
    logger.error('[RxDB-Premium] initRxDB error', error);
  }
}

export async function removeRxDB({ name = dbName }: { name: string }) {
  try {
    logger.debug(`[removeRxDB] dbName: ${name}`);
    await removeRxDatabase(name, rxStoragePouch);
  } catch (error) {
    logger.error('[RxDB-Premium] removeRxDB error', error);
  }
  rxDBInstance = undefined;
}
