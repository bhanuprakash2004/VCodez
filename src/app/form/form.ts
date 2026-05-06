import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WaterService } from '../water';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class FormComponent {

  data = {
    area: '',
    ph: '',
    turbidity: '',
    temperature: ''
  };

  result: any;
  message = '';
  chart: any;

  constructor(private service: WaterService) {}

  submit() {

    if (!this.data.area || !this.data.ph || !this.data.turbidity || !this.data.temperature) {
      this.message = "Please fill all fields";
      return;
    }

    const user = localStorage.getItem('user');
const payload = {
  ph: this.data.ph,
  turbidity: this.data.turbidity,
  temperature: this.data.temperature,
  user: user,
  area: this.data.area   // 👈 ADD THIS
};

    this.service.addData(payload).subscribe({
      next: (res: any) => {

        if (res.quality) {
          this.result = res;
          this.message = '';

          this.loadChart();

          this.data = {
            area: '',
            ph: '',
            turbidity: '',
            temperature: ''
          };

        } else {
          this.message = "Error saving data";
        }
      },
      error: () => {
        this.message = "Server error";
      }
    });
  }

  loadChart() {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart('myChart', {
      type: 'pie',
      data: {
        labels: ['Good', 'Poor'],
        datasets: [{
          data: [
            this.result.quality === 'Good' ? 1 : 0,
            this.result.quality === 'Poor' ? 1 : 0
          ]
        }]
      }
    });
  }
}
