import { RxCollectionCreator } from 'rxdb/dist/types/types/rx-collection';

const collectionVersion = 0;
const commonJson: RxCollectionCreator['schema']['properties'] = {
  uuid: {
    type: 'string',
    maxLength: 100,
  },
  data: {
    type: 'object', // sql-lite json1
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    maxLength: 24,
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    maxLength: 24,
  },
};

export const rxdbCollections: Record<string, RxCollectionCreator> = {
  product: {
    autoMigrate: true,
    schema: {
      keyCompression: false,
      version: collectionVersion,
      primaryKey: 'uuid',
      type: 'object',
      properties: {
        ...commonJson,
      },
      required: ['uuid', 'data', 'createdAt', 'updatedAt'],
      indexes: ['createdAt', 'updatedAt'],
    },
  },
};

//

export const retryTimes = {
  product: 3 * 1000,
};

//
export interface Product {
  id: number;
  uuid: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RxDBProduct {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  _deleted: boolean;
  data: Product;
}

export interface RxDBProductCheckpoint {
  uuid: string;
  updatedAt: string;
}
