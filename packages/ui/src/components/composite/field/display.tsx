import React, { useMemo } from 'react';
import { IFieldValueTypes } from '@falcojs/ui/types';

export interface IFieldProps<V, T extends keyof IFieldValueTypes> {
  value: V;
  type: T;
  config?: IFieldValueTypes[T];
  render?: (value: V, config: IFieldValueTypes[T], dom: React.ReactNode) => React.ReactNode;
}

export function FieldDisplay<V, T extends keyof IFieldValueTypes>(props: IFieldProps<V, T>): React.ReactNode {
  const { value, type, config = {}, render } = props;

  const dom = useMemo(() => {
    const renderFn = FieldDisplay.render[type];
    const dom = renderFn?.(value, config as IFieldValueTypes[T]);
    if (render) return render(value, config as IFieldValueTypes[T], dom);
    return dom;
  }, [value, type, config, render]);

  return dom;
}

FieldDisplay.render = {} as IFieldValueTypes;

FieldDisplay.register = <T extends keyof IFieldValueTypes>(type: T, render: IFieldValueTypes[T]) => {
  FieldDisplay.render[type] = render;
};
