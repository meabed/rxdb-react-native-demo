import 'react-native-get-random-values';
import 'fast-text-encoding';

import { logger } from '../utils/logger';
import { rxdbCollections } from './common';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
import SQLite from 'react-native-sqlite-2';
import { RxDatabase, addRxPlugin, createRxDatabase, removeRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
addPouchPlugin(SQLiteAdapter);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);
//
if (__DEV__) {
  addRxPlugin(RxDBDevModePlugin);
}

export let rxDBInstance: RxDatabase;
const rxStoragePouch = getRxStoragePouch('react-native-sqlite');

export let dbName = `pouchdb-demo-db-v0`;

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
    logger.debug('[RxDB-PouchDB] rxDBInstance created');
    try {
      await rxDBInstance.addCollections(rxdbCollections);
    } catch (error) {
      logger.error('[RxDB-PouchDB] error creating collections', error);
    }
    logger.debug('[RxDB-PouchDB] initRxDB success');
    return rxDBInstance;
  } catch (error) {
    logger.error('[RxDB-PouchDB] initRxDB error', error);
  }
}

export async function removeRxDB({ name = dbName }: { name: string }) {
  try {
    logger.debug(`[removeRxDB] dbName: ${name}`);
    await removeRxDatabase(name, rxStoragePouch);
  } catch (error) {
    logger.error('[RxDB-PouchDB] removeRxDB error', error);
  }
  rxDBInstance = undefined;
}
