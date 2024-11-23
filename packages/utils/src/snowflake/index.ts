export class Snowflake {
    private twepoch = 1288834974657n;
    private sequence = 0n;
    private lastTimestamp = -1n;
    private datacenterId: bigint;
    private workerId: bigint;
    private sequenceMask = 4095n;
    private timestampLeftShift = 22n;
    private datacenterIdShift = 17n;
    private workerIdShift = 12n;
  
    constructor(datacenterId: number, workerId: number) {
      this.datacenterId = BigInt(datacenterId);
      this.workerId = BigInt(workerId);
    }
  
    private timeGen = (): bigint => {
      return BigInt(Date.now());
    };
  
    private tilNextMillis = (lastTimestamp: bigint): bigint => {
      let timestamp = this.timeGen();
      while (timestamp <= lastTimestamp) {
        timestamp = this.timeGen();
      }
      return timestamp;
    };
  
    public nextId = (): string => {
      let timestamp = this.timeGen();
  
      if (timestamp < this.lastTimestamp) {
        throw new Error(
          `Clock moved backwards. Refusing to generate id for ${this.lastTimestamp - timestamp} milliseconds`,
        );
      }
  
      if (this.lastTimestamp === timestamp) {
        this.sequence = (this.sequence + 1n) & this.sequenceMask;
        if (this.sequence === 0n) {
          timestamp = this.tilNextMillis(this.lastTimestamp);
        }
      } else {
        this.sequence = 0n;
      }
  
      this.lastTimestamp = timestamp;
  
      const id =
        ((timestamp - this.twepoch) << this.timestampLeftShift) |
        (this.datacenterId << this.datacenterIdShift) |
        (this.workerId << this.workerIdShift) |
        this.sequence;
  
      return id.toString();
    };
  }