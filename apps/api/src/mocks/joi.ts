// Mock for joi validation library
export const string = () => ({
  required: () => ({ error: null }),
  min: () => ({ error: null }),
  max: () => ({ error: null })
});

export const number = () => ({
  required: () => ({ error: null }),
  min: () => ({ error: null }),
  max: () => ({ error: null })
});

export const object = (schema: any) => ({
  validate: (data: any) => ({ error: null, value: data })
});

export default {
  string,
  number,
  object
};