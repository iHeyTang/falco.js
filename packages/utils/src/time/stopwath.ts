export class Stopwatch {
  private startTime: number | null = null;
  private pausedTime: number | null = null;
  private totalPausedTime: number = 0;
  private isRunning: boolean = false;

  /**
   * 启动秒表
   * @throws {Error} 如果秒表已经在运行则抛出错误
   */
  start(): void {
    if (this.isRunning) {
      throw new Error('Stopwatch is already running');
    }

    if (this.pausedTime !== null) {
      // 从暂停状态恢复
      this.totalPausedTime += performance.now() - this.pausedTime;
      this.pausedTime = null;
    } else {
      // 首次启动
      this.startTime = performance.now();
      this.totalPausedTime = 0;
    }

    this.isRunning = true;
  }

  /**
   * 暂停秒表
   * @throws {Error} 如果秒表未在运行则抛出错误
   */
  pause(): void {
    if (!this.isRunning) {
      throw new Error('Stopwatch is not running');
    }

    this.pausedTime = performance.now();
    this.isRunning = false;
  }

  /**
   * 重置秒表
   */
  reset(): void {
    this.startTime = null;
    this.pausedTime = null;
    this.totalPausedTime = 0;
    this.isRunning = false;
  }

  /**
   * 获取经过的时间（毫秒）
   * @returns {number} 经过的毫秒数
   * @throws {Error} 如果秒表未启动则抛出错误
   */
  getElapsedMilliseconds(): number {
    if (this.startTime === null) {
      throw new Error('Stopwatch has not been started');
    }

    const currentTime = this.isRunning ? performance.now() : (this.pausedTime as number);
    return currentTime - this.startTime - this.totalPausedTime;
  }

  /**
   * 获取经过的时间（秒）
   * @returns {number} 经过的秒数（保留3位小数）
   */
  getElapsedSeconds(): number {
    return Number((this.getElapsedMilliseconds() / 1000).toFixed(3));
  }

  /**
   * 获取格式化的时间字符串 (HH:MM:SS.mmm)
   * @returns {string} 格式化的时间字符串
   */
  getElapsedTimeFormatted(): string {
    const ms = this.getElapsedMilliseconds();

    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(3, '0')}`;
  }

  /**
   * 检查秒表是否在运行
   * @returns {boolean} 是否在运行
   */
  isActive(): boolean {
    return this.isRunning;
  }
}
