declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    [key: string]: (value: any, config: unknown) => React.ReactNode;
  }
}
