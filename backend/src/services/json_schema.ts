import { Draft, Draft04, JsonError, JsonSchema } from 'json-schema-library';

export const getJsonSchemaValidationResult = async (schema: JsonSchema, data: unknown): Promise<JsonError[]> => {
  const jsonSchema: Draft = new Draft04(schema);
  return jsonSchema.validate(data);
};

export const hasJsonSchemaValidationErrors = async (schema: JsonSchema, data: unknown): Promise<boolean> => {
  const errors = await getJsonSchemaValidationResult(schema, data);
  return errors.length > 0;
};
