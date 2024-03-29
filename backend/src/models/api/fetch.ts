import { Response } from "express";

export type TResponse = {
  // eslint-disable-next-line no-use-before-define
  body: any;
  status: number;
  statusOk: boolean;
};

// eslint-disable-next-line no-use-before-define
export type ExpressResponse = Response<any, Record<string, any>>;
