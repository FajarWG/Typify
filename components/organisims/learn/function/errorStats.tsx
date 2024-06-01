import Counter from "./counter";

class ErrorStats {
  private currentStatsEl: HTMLSpanElement | null;
  private averageStatsEl: HTMLSpanElement | null;
  private stats: number[];

  constructor() {
    // Initialize the refs to null
    this.currentStatsEl = null;
    this.averageStatsEl = null;
    this.stats = [];
  }

  // Update the DOM elements based on the current and average error statistics
  private updateStatsDisplay(
    currentPercentage: string,
    averagePercentage: string
  ) {
    if (this.currentStatsEl) {
      this.currentStatsEl.textContent = currentPercentage;
    }
    if (this.averageStatsEl) {
      this.averageStatsEl.textContent = averagePercentage;
    }
  }

  // Update the average error statistics
  private updateAverage(percentage: number) {
    this.stats.push(percentage);

    const total = this.stats.reduce((acc, p) => acc + p, 0);
    const averagePercentage = (total / this.stats.length).toFixed(2) + "%";

    if (this.averageStatsEl) {
      this.updateStatsDisplay(percentage.toFixed(2) + "%", averagePercentage);
    }
  }

  // Update the current error statistics
  public update(counter: Counter, letters: string) {
    const percentage = (counter.get() * 100) / letters.length;

    this.updateAverage(percentage);

    if (this.currentStatsEl) {
      this.updateStatsDisplay(
        percentage.toFixed(2) + "%",
        this.averageStatsEl?.textContent || "0.00%"
      );
    }
  }

  // Set the DOM elements references when the component mounts
  public setDOMElements(
    currentStatsEl: HTMLSpanElement,
    averageStatsEl: HTMLSpanElement
  ) {
    this.currentStatsEl = currentStatsEl;
    this.averageStatsEl = averageStatsEl;
  }
}

export default ErrorStats;
