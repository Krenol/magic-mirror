import { Draft04, Draft, JSONError } from "json-schema-library";

export const getJsonSchemaValidationResult = async (
  schema: any,
  data: any,
): Promise<JSONError[]> => {
  const jsonSchema: Draft = new Draft04(schema);
  return jsonSchema.validate(data);
};

export const hasJsonSchemaValidationErrors = async (
  schema: any,
  data: any,
): Promise<boolean> => {
  const errors = await getJsonSchemaValidationResult(schema, data);
  return errors.length > 0;
};
