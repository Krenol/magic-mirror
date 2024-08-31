import { Response } from 'express';

export interface ApiResponse<T> {
  status: number;
  statusOk: boolean;
  body: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpressResponse = Response<any, Record<string, any>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = Record<string, any>;
