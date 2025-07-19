export const convertToJSONSchema = (fields) => {
  const schema = {};

  fields.forEach((field) => {
    if (!field.key) return;

    if (field.type === 'Nested') {
      schema[field.key] = {
        type: 'object',
        properties: convertToJSONSchema(field.children),
      };
    } else {
      schema[field.key] = {
        type: field.type.toLowerCase(),
        default: field.type === 'String' ? "" : 0,
      };
    }
  });

  return schema;
};
