type IFieldBooleanConfig = { trueLabel?: React.ReactNode; falseLabel?: React.ReactNode };

export const renderBoolean = (value: any, config?: IFieldBooleanConfig) => {
  const { trueLabel = '是', falseLabel = '否' } = config as IFieldBooleanConfig;
  return value ? trueLabel : falseLabel;
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    boolean?: typeof renderBoolean;
  }
}
