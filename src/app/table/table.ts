import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterService } from '../water';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css']
})
export class TableComponent implements OnInit, OnDestroy {

  records: any[] = [];
  message = '';
  loading = true;

  intervalId: any; // ✅ store interval

  constructor(private service: WaterService) {}

  ngOnInit() {
    this.loadData(); // ✅ first load immediately

    // ✅ auto refresh every 5 sec
    this.intervalId = setInterval(() => {
      this.loadData();
    }, 5000);
  }

  ngOnDestroy() {
    // ✅ clear interval when leaving page
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadData() {
    const user = localStorage.getItem('user');

    console.log("Fetching data for:", user);

    this.loading = true;

    this.service.getAll(user).subscribe({
      next: (res: any) => {

        console.log("API Response:", res);

        this.records = res || [];

        if (this.records.length === 0) {
          this.message = "No data found";
        } else {
          this.message = '';
        }

        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.message = "Error loading data";
        this.loading = false;
      }
    });
  }
}
