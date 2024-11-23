import { plugins } from './plugins';

export interface ServiceContextPlugins {}

export type ServiceContext<T> = ServiceContextPlugins & {
  /** 请求数据 */
  data: T;
};

export type ServiceContextPluginLoader<
  Name extends keyof ServiceContextPlugins = keyof ServiceContextPlugins,
  Plugin extends ServiceContextPlugins[Name] = ServiceContextPlugins[Name],
> = {
  name: Name;
  dependencies?: (keyof ServiceContextPlugins)[];
  loader: (context: ServiceContext<any>) => Promise<Plugin> | Plugin;
};

/**
 * ServiceContext
 */
export const createContext = async <P>(params: { data: P }) => {
  const context: ServiceContext<P> = {
    data: params.data,
  } as ServiceContext<P>;

  // 记录已加载的插件
  const loadedPlugins = new Set<string>();
  // 记录正在加载的插件,用于检测循环依赖
  const loadingPlugins = new Set<string>();

  // 递归加载插件及其依赖
  const loadPlugin = async (pluginLoader: (typeof plugins)[0]) => {
    // 如果插件已加载则跳过
    if (loadedPlugins.has(pluginLoader.name)) {
      return;
    }

    // 检测循环依赖
    if (loadingPlugins.has(pluginLoader.name)) {
      throw new Error(`检测到循环依赖: ${Array.from(loadingPlugins).join(' -> ')} -> ${pluginLoader.name}`);
    }

    // 标记插件正在加载
    loadingPlugins.add(pluginLoader.name);

    // 先加载依赖的插件
    if (pluginLoader.dependencies?.length) {
      for (const depName of pluginLoader.dependencies) {
        const depPlugin = plugins.find(p => p.name === depName);
        if (!depPlugin) {
          throw new Error(`找不到依赖的插件: ${depName}`);
        }
        await loadPlugin(depPlugin);
      }
    }

    // 加载当前插件
    const plugin = await pluginLoader.loader(context);
    context[pluginLoader.name] = plugin as any;
    loadedPlugins.add(pluginLoader.name);
    loadingPlugins.delete(pluginLoader.name);
  };

  // 加载所有插件
  for (const pluginLoader of plugins) {
    await loadPlugin(pluginLoader);
  }

  return context;
};
