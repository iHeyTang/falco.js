type IFieldEnumConfig = { options: { label: React.ReactNode; value: any }[] | any[]; mode?: 'tags' };

export const renderEnum = (value: any, config?: IFieldEnumConfig) => {
  const { options, mode = 'tags' } = config as IFieldEnumConfig;
  return mode === 'tags' ? options.find(o => o.value === value)?.label : options.find(o => o.value === value)?.label;
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    enum?: typeof renderEnum;
  }
}
