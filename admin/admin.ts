import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Chart } from 'chart.js/auto';

import { WaterService } from '../water';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  totalUsers = 0;

  totalRecords = 0;

  goodWater = 0;

  moderateWater = 0;

  poorWater = 0;

  userStats: any[] = [];

  chart: any;

  constructor(
    private service: WaterService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.service.getAdminStats().subscribe({

      next: (res: any) => {

        this.totalUsers =
          Number(res.totalUsers);

        this.totalRecords =
          Number(res.totalRecords);

        this.goodWater =
          Number(res.goodWater);

        this.moderateWater =
          Number(res.moderateWater);

        this.poorWater =
          Number(res.poorWater);

        this.userStats =
          res.userStats || [];

        this.loadChart();

      },

      error: (err: any) => {

        console.log(err);

      }

    });

  }

  loadChart(): void {

    if (this.chart) {

      this.chart.destroy();

    }

    this.chart = new Chart('adminChart', {

      type: 'doughnut',

      data: {

        labels: [
          'Good Water',
          'Moderate Water',
          'Poor Water'
        ],

        datasets: [{

          data: [

            this.goodWater,

            this.moderateWater,

            this.poorWater

          ],

          backgroundColor: [

            '#0f766e',

            '#f59e0b',

            '#dc2626'

          ],

          hoverBackgroundColor: [

            '#14b8a6',

            '#fbbf24',

            '#ef4444'

          ],

          borderWidth: 0

        }]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        cutout: '65%',

        plugins: {

          legend: {

            position: 'bottom',

            labels: {

              color: '#1e293b',

              padding: 20,

              font: {

                size: 14,

                weight: 'bold'

              }

            }

          }

        }

      }

    });

  }

  logout(): void {

    localStorage.clear();

    this.router.navigate(['/']);

  }

}
