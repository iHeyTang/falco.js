import dayjs from 'dayjs';

type IFieldDateConfig = { format?: (v: string) => string };

export const renderDate = (value: any, config?: IFieldDateConfig) => {
  const { format = 'YYYY-MM-DD' } = config as IFieldDateConfig;
  if (typeof format === 'function') {
    return format(value);
  }
  return dayjs(value).format(format);
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    date?: typeof renderDate;
  }
}
