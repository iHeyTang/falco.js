import dayjs from 'dayjs';

type IFieldTimeConfig = { format?: string | ((v: any) => string) };

export const renderTime = (value: any, config?: IFieldTimeConfig) => {
  const { format = 'HH:mm:ss' } = config as IFieldTimeConfig;
  if (typeof format === 'function') {
    return format(value);
  }
  return dayjs(value).format(format);
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    time?: typeof renderTime;
  }
}
