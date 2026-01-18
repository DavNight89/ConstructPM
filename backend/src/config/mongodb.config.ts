import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongodbConfig = registerAs(
  'mongodb',
  (): MongooseModuleOptions => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/constructpm',
  }),
);
