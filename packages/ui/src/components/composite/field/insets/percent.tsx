type IFieldPercentConfig = { format?: (v: number) => string; fractionDigits?: number; total?: number };

export const renderPercent = (value: any, config?: IFieldPercentConfig) => {
  const { format = (v: number) => `${v}%`, fractionDigits, total = 1 } = config as IFieldPercentConfig;
  const num = fractionDigits ? Number((value / total).toFixed(fractionDigits)) : value / total;
  return format(num);
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    percent?: typeof renderPercent;
  }
}
