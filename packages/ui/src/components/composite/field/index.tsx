import { IFieldProps, FieldDisplay } from './display';
import { renderText } from './insets/text';
import { renderBoolean } from './insets/boolean';
import { renderEnum } from './insets/enum';
import { renderDate } from './insets/date';
import { renderNumber } from './insets/number';
import { renderTime } from './insets/time';
import { renderDateTime } from './insets/datetime';
import { renderPercent } from './insets/percent';
import { IFieldValueTypes } from '@falcojs/ui/types';

FieldDisplay.register('text', renderText);
FieldDisplay.register('number', renderNumber);
FieldDisplay.register('percent', renderPercent);
FieldDisplay.register('date', renderDate);
FieldDisplay.register('datetime', renderDateTime);
FieldDisplay.register('time', renderTime);
FieldDisplay.register('enum', renderEnum);
FieldDisplay.register('boolean', renderBoolean);

export function Field<V, T extends keyof IFieldValueTypes>(props: IFieldProps<V, T>) {
  const { value, type, config = {}, render } = props;
  if (render) return render(value, config as IFieldValueTypes[T], null);
  const renderFn = FieldDisplay.render[type];
  return renderFn ? renderFn(value, config) : null;
}
