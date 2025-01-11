type IFieldTextConfig = { ellipsisLength?: number; ellipsisPosition?: 'start' | 'end' | 'middle'; ellipsisPlacement?: React.ReactNode };

export const renderText = (value: any, config?: IFieldTextConfig) => {
  const { ellipsisLength, ellipsisPosition = 'end', ellipsisPlacement = '...' } = config as IFieldTextConfig;

  // 如果没有设置截断长度或值不是字符串，直接返回原值
  if (!ellipsisLength || typeof value !== 'string') {
    return value;
  }

  // 如果字符串长度小于截断长度，直接返回
  if (value.length <= ellipsisLength) {
    return value;
  }

  // 根据不同的截断位置进行处理
  switch (ellipsisPosition) {
    case 'start':
      // 从开始位置截断，保留后面的内容
      return ellipsisPlacement + value.slice(-ellipsisLength);

    case 'middle': {
      // 从中间截断，保留前后的内容
      const halfLength = Math.floor(ellipsisLength / 2);
      const startStr = value.slice(0, halfLength);
      const endStr = value.slice(-halfLength);
      return startStr + ellipsisPlacement + endStr;
    }

    case 'end':
    default:
      // 从结尾截断，保留前面的内容
      return value.slice(0, ellipsisLength) + ellipsisPlacement;
  }
};

declare module '@falcojs/ui/types' {
  interface IFieldValueTypes {
    text?: typeof renderText;
  }
}
