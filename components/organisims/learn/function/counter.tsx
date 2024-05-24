// components/Wordline/Counter.ts
class Counter {
    private count: number;
  
    constructor(start: number = 0) {
      this.count = start;
    }
  
    public get(): number {
      return this.count;
    }
  
    public set(count: number): void {
      this.count = count;
    }
  
    public up(): number {
      return ++this.count;
    }
  
    public reset(): void {
      this.count = 0;
    }
  }
  
  export default Counter;
  