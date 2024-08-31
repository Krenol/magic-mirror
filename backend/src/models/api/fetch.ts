import { Response } from 'express';

export type TResponse = {
  body: any;
  status: number;
  statusOk: boolean;
};

export type ExpressResponse = Response<any, Record<string, any>>;
