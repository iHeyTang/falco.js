export const parseJson = <T = any>(text: any, options?: { default?: T; reviver?: (this: any, key: string, value: any) => any }) => {
  try {
    return JSON.parse(text, options?.reviver) as T;
  } catch (e: any) {
    return options?.default ?? null;
  }
};
