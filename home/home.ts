import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WaterService } from '../water';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  totalRecords = 0;
  goodWater = 0;
  moderateWater = 0;
  poorWater = 0;

  loading = true;
  chartReady = false;

  chart: any;

  constructor(private service: WaterService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  ngAfterViewInit() {
    this.chartReady = true;
  }

  loadDashboard() {
    const user = localStorage.getItem('user');

    this.service.getAll(user).subscribe({
      next: (res: any) => {
        const data = res || [];

        this.totalRecords = data.length;
        this.goodWater = data.filter((x: any) => x.quality === 'Good').length;
        this.moderateWater = data.filter((x: any) => x.quality === 'Moderate').length;
        this.poorWater = data.filter((x: any) => x.quality === 'Poor').length;

        this.loading = false;

        setTimeout(() => {
          this.loadChart();
        }, 300);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadChart() {
    const canvas = document.getElementById('dashboardChart') as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Good', 'Moderate', 'Poor'],
        datasets: [{
          data: [
            this.goodWater,
            this.moderateWater,
            this.poorWater
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
