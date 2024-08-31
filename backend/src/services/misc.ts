import { Request } from 'express';

export const requestQueryContainsParam = async (req: Request, paramName: string): Promise<boolean> => {
  return paramName in req.query;
};

export const requestContainsParam = async (req: Request, paramName: string): Promise<boolean> => {
  return paramName in req.params;
};
