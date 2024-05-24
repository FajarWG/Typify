import React, { useEffect, useRef } from 'react';

class SpeedStats {
  private currentStatsEl: HTMLElement | null;
  private averageStatsEl: HTMLElement | null;
  private stats: number[];

  constructor() {
    this.currentStatsEl = document.querySelector('.speed-current');;
    this.averageStatsEl = document.querySelector('.speed-average');;;
    this.stats = [];
  }

  public setDOMElements(currentStatsEl: HTMLElement | null, averageStatsEl: HTMLElement | null) {
    this.currentStatsEl = currentStatsEl;
    this.averageStatsEl = averageStatsEl;
  }

  private updateAverage(speed: number) {
    this.stats.push(speed);

    const total = this.stats.reduce((acc, s) => acc + s, 0);
    const averageSpeed = Math.round(total / this.stats.length);

    if (this.averageStatsEl) {
      this.averageStatsEl.textContent = averageSpeed.toString();
    }
  }

  public update(time: number, letters: string) {
    const speed = Math.round((letters.length / (time / 1000)) * 60);

    this.updateAverage(speed);

    if (this.currentStatsEl) {
      this.currentStatsEl.textContent = speed.toString();
    }
  }
}

export default SpeedStats;
