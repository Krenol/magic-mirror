export type QueryParameters = Array<QUERY_PARAM>;

export type QUERY_PARAM = {
  name: string;
  value?: string | number | boolean;
};
