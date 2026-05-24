import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { WaterService } from '../water';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule, NgClass],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})

export class FormComponent {

  @ViewChild('myChart')
  myChart!: ElementRef<HTMLCanvasElement>;

  data = {
    area: '',
    ph: '',
    turbidity: '',
    temperature: ''
  };

  result: any = null;

  message = '';

  chart: any;

  checked = false;

  constructor(
    private service: WaterService,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {

    this.message = '';

    if (
      !this.data.area ||
      !this.data.ph ||
      !this.data.turbidity ||
      !this.data.temperature
    ) {

      this.message = 'Please fill all fields';

      return;
    }

    const ph = Number(this.data.ph);

    const turbidity = Number(this.data.turbidity);

    const temperature = Number(this.data.temperature);

    if (ph < 0 || ph > 14) {

      this.message =
        'pH value must be between 0 and 14';

      return;
    }

    if (turbidity < 0 || turbidity > 100) {

      this.message =
        'Turbidity value must be between 0 and 100 NTU';

      return;
    }

    if (temperature < 0 || temperature > 100) {

      this.message =
        'Temperature value must be between 0°C and 100°C';

      return;
    }

    const analysis =
      this.getWaterAnalysis(
        ph,
        turbidity,
        temperature
      );

    const payload = {

      area: this.data.area,

      ph: ph,

      turbidity: turbidity,

      temperature: temperature,

      user: localStorage.getItem('user')

    };

    this.service.addData(payload).subscribe({

      next: (res: any) => {

        if (res.status === 'success') {

          this.result = {

            ...res,

            quality:
              res.quality || analysis.quality,

            usage:
              res.usage || analysis.usage,

            badge:
              analysis.badge,

            purpose:
              analysis.purpose,

            temperatureNote:
              analysis.temperatureNote,

            meter:
              analysis.meter

          };

          this.checked = true;

          this.cdr.detectChanges();

          this.loadChart(
            ph,
            turbidity,
            temperature
          );

        } else {

          this.message =
            res.msg || 'Error saving data';
        }

      },

      error: () => {

        this.message = 'Server error';

      }

    });

  }

  getWaterAnalysis(
    ph: number,
    turbidity: number,
    temperature: number
  ) {

    let temperatureNote = '';

    if (temperature < 20) {

      temperatureNote =
        'Water is cold. If pH and turbidity are safe, it can still be drinkable.';

    }
    else if (temperature <= 35) {

      temperatureNote =
        'Water temperature is normal and comfortable for general use.';

    }
    else {

      temperatureNote =
        'Water is warm or hot. If pH and turbidity are safe, it may still be usable after cooling.';
    }

    if (
      ph >= 6.5 &&
      ph <= 8.5 &&
      turbidity <= 5
    ) {

      return {

        quality: 'Good',

        badge: 'Safe Drinking Water',

        usage:
          'Suitable for drinking, cooking, and domestic use',

        purpose:
          'This water is suitable for drinking, cooking, and regular household use.',

        temperatureNote:
          temperatureNote,

        meter: 95
      };
    }

    if (
      ph >= 6.0 &&
      ph <= 9.0 &&
      turbidity <= 10
    ) {

      return {

        quality: 'Moderate',

        badge: 'Useful Water',

        usage:
          'Suitable for agriculture, gardening, and cleaning',

        purpose:
          'This water is not ideal for direct drinking, but it can be used for agriculture, gardening, and cleaning.',

        temperatureNote:
          temperatureNote,

        meter: 65
      };
    }

    if (turbidity <= 20) {

      return {

        quality: 'Poor',

        badge: 'Treatment Required',

        usage:
          'Can be used for industrial purposes after treatment',

        purpose:
          'This water is poor for drinking. It may be used for industrial or non-drinking purposes after proper treatment.',

        temperatureNote:
          temperatureNote,

        meter: 35
      };
    }

    return {

      quality: 'Poor',

      badge: 'Unsafe Water',

      usage:
        'Unsafe water. Treatment required before use',

      purpose:
        'This water is unsafe for direct use. Proper treatment is required before using it.',

      temperatureNote:
        temperatureNote,

      meter: 15
    };
  }

  newCheck() {

    this.data = {

      area: '',
      ph: '',
      turbidity: '',
      temperature: ''

    };

    this.result = null;

    this.message = '';

    this.checked = false;

    if (this.chart) {

      this.chart.destroy();

      this.chart = null;
    }
  }

  loadChart(
    ph: number,
    turbidity: number,
    temperature: number
  ) {

    if (this.chart) {

      this.chart.destroy();

    }

    this.chart = new Chart(

      this.myChart.nativeElement,

      {

        type: 'bar',

        data: {

          labels: [
            'pH',
            'Turbidity',
            'Temperature'
          ],

          datasets: [{

            label: 'Water Parameters',

            data: [
              ph,
              turbidity,
              temperature
            ],

            borderRadius: 12,

            backgroundColor: [
              '#0f766e',
              '#2563eb',
              '#f59e0b'
            ],

            hoverBackgroundColor: [
              '#14b8a6',
              '#3b82f6',
              '#fbbf24'
            ]

          }]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {
  legend: {
    labels: {
      color: '#1e293b',
      font: {
        size: 14,
        weight: 'bold'
      },
      boxWidth: 0
    }
  }
},

          scales: {

            x: {

              ticks: {

                color: '#334155',

                font: {
                  weight: 'bold'
                }

              },

              grid: {
                display: false
              }

            },

            y: {

              beginAtZero: true,

              ticks: {
                color: '#334155'
              },

              grid: {
                color:
                  'rgba(148,163,184,0.2)'
              }

            }

          }

        }

      }

    );

  }

}
