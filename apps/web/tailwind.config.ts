import { Config } from 'tailwindcss';
import sharedConfig from '@repo/ui/tailwind.config';

const config: Config = {
  // 继承 UI 库的配置
  presets: [sharedConfig],

  // 添加当前项目特定的配置
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],

  // 其他项目特定配置...
};

export default config;
