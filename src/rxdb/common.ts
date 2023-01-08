import { RxCollectionCreator } from 'rxdb/dist/types/types/rx-collection';

const collectionVersion = 0;
const commonJson: RxCollectionCreator['schema']['properties'] = {
  id: {
    type: 'number',
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
      primaryKey: 'id',
      type: 'object',
      properties: {
        ...commonJson,
      },
      required: ['id', 'data', 'createdAt', 'updatedAt'],
      indexes: ['createdAt', 'updatedAt'],
    },
  },
};

//

export const retryTimes = {
  product: 7 * 1000,
};

//
export interface Product {
  id: number;
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
  id: number;
  createdAt: string;
  updatedAt: string;
  _deleted: boolean;
  data: Product;
}

export interface RxDBProductCheckpoint {
  id: number;
  updatedAt: string;
}
