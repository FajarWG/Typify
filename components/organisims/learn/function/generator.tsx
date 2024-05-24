import { words } from './words'; // Make sure you have the correct path to the words file

interface GeneratorArgs {
  interval?: number;
  number?: number;
  lesson: keyof typeof words; // New argument to specify the lesson
}

class Generator {
  private interval: number;
  private number: number;
  private lesson: keyof typeof words;
  private words: string[];
  private currentIndex: number;

  constructor(args: GeneratorArgs) {
    this.interval = args.interval || 60000;
    this.number = args.number || 1;
    this.lesson = args.lesson;
    this.words = words[this.lesson];
    this.currentIndex = 0;

    setInterval(() => this.update(), this.interval);
  }

  private update(): void {
    this.currentIndex = (this.currentIndex + 1) % this.words.length;
  }

  public getWords(): string {
    return this.words[this.currentIndex];
  }

  public getOne(): string {
    return this.words[this.currentIndex];
  }
}

export default Generator;
