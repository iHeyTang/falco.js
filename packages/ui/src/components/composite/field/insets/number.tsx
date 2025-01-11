type IFieldNumberConfig = { format?: (v: number) => string; fractionDigits?: number };

export const renderNumber = (value: any, config?: IFieldNumberConfig) => {
  const { format, fractionDigits } = config as IFieldNumberConfig;
  const num = fractionDigits ? Number(value.toFixed(fractionDigits)) : value;
  return format ? format(num) : num;
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    number?: typeof renderNumber;
  }
}
