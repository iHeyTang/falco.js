import dayjs from 'dayjs';

type IFieldDateTimeConfig = { format?: string | ((v: any) => string) };

export const renderDateTime = (value: any, config?: IFieldDateTimeConfig) => {
  const { format = 'YYYY-MM-DD HH:mm:ss' } = config as IFieldDateTimeConfig;
  if (typeof format === 'function') {
    return format(value);
  }
  return dayjs(value).format(format);
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    datetime?: typeof renderDateTime;
  }
}
