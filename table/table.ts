import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaterService } from '../water';
import { Chart } from 'chart.js/auto';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css']
})
export class TableComponent implements OnInit, OnDestroy {

  records: any[] = [];
  filteredRecords: any[] = [];
  selectedIds: any[] = [];

  selectedChartRecords: any[] = [];
  charts: any[] = [];
  showChart = false;

  message = '';
  loading = true;

  searchText = '';
  selectedQuality = 'All';

  currentPage = 1;
  itemsPerPage = 10;

  intervalId: any;

  constructor(private service: WaterService) {}

  ngOnInit() {
    this.loadData();

    this.intervalId = setInterval(() => {
      this.loadData(false);
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.destroyCharts();
  }

  loadData(resetPage: boolean = true) {
    const user = localStorage.getItem('user');

    this.loading = true;

    this.service.getAll(user).subscribe({
      next: (res: any) => {
        this.records = res || [];
        this.applyFilters();

        if (resetPage) {
          this.currentPage = 1;
        }

        this.message = this.records.length === 0 ? 'No data found' : '';
        this.loading = false;
      },
      error: () => {
        this.message = 'Error loading data';
        this.loading = false;
      }
    });
  }
  clearAll() {
  this.searchText = '';
  this.selectedQuality = 'All';

  this.filteredRecords = [...this.records];
  this.currentPage = 1;

  this.selectedIds = [];

  this.showChart = false;
  this.selectedChartRecords = [];

  this.message = '';
}
  search() {
    this.applyFilters();
    this.currentPage = 1;
  }

  filterQuality() {
    this.applyFilters();
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchText = '';
    this.selectedQuality = 'All';
    this.applyFilters();
    this.currentPage = 1;
  }

  applyFilters() {
    const text = this.searchText.toLowerCase();

    this.filteredRecords = this.records.filter(d => {
      const matchesSearch =
        (d.area || '').toLowerCase().includes(text) ||
        (d.quality || '').toLowerCase().includes(text) ||
        (d.usage || '').toLowerCase().includes(text);

      const matchesQuality =
        this.selectedQuality === 'All' ||
        d.quality === this.selectedQuality;

      return matchesSearch && matchesQuality;
    });

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  sort(column: string) {
    this.filteredRecords.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;

      return 0;
    });
  }

  get paginatedRecords() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRecords.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredRecords.length / this.itemsPerPage) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  toggleSelect(id: any, event: any) {
    if (event.target.checked) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    }

    this.closeCharts();
  }

  isSelected(id: any) {
    return this.selectedIds.includes(id);
  }

  showSelectedCharts() {
    this.selectedChartRecords = this.records.filter(r =>
      this.selectedIds.includes(r.id)
    );

    if (this.selectedChartRecords.length === 0) {
      alert('Please select at least one record');
      return;
    }

    this.showChart = true;

    setTimeout(() => {
      this.loadAllCharts();
    }, 100);
  }

  loadAllCharts() {
    this.destroyCharts();

    this.selectedChartRecords.forEach((record, index) => {
      const canvasId = 'chart_' + index;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

      if (!canvas) {
        return;
      }

      const chart = new Chart(canvas, {
        type: 'bar',

        data: {
          labels: ['pH', 'Turbidity', 'Temperature'],

          datasets: [{
            label: 'Water Parameters',

            data: [
              Number(record.ph),
              Number(record.turbidity),
              Number(record.temperature)
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
                color: 'rgba(148,163,184,0.2)'
              }
            }
          }
        }
      });

      this.charts.push(chart);
    });
  }

  closeCharts() {
    this.showChart = false;
    this.selectedChartRecords = [];
    this.destroyCharts();
  }

  destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  deleteSelected() {
    if (this.selectedIds.length === 0) {
      return;
    }

    if (confirm('Are you sure you want to delete selected records?')) {
      let deleted = 0;

      this.selectedIds.forEach(id => {
        this.service.deleteRecord(id).subscribe(() => {
          deleted++;

          if (deleted === this.selectedIds.length) {
            this.selectedIds = [];
            this.closeCharts();
            this.loadData();
          }
        });
      });
    }
  }

  downloadPDF() {
    const dataToExport = this.selectedIds.length > 0
      ? this.records.filter(r => this.selectedIds.includes(r.id))
      : this.filteredRecords;

    if (dataToExport.length === 0) {
      alert('No records available to export');
      return;
    }

    const doc = new jsPDF();
    const user = localStorage.getItem('user') || 'User';

    doc.setFontSize(18);
    doc.text('Water Quality Analysis Report', 14, 20);

    doc.setFontSize(11);
    doc.text(`User: ${user}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);

    autoTable(doc, {
      startY: 48,
      head: [['Area', 'pH', 'Turbidity', 'Temperature', 'Quality', 'Usage']],
      body: dataToExport.map(d => [
        d.area,
        d.ph,
        d.turbidity,
        d.temperature,
        d.quality,
        d.usage || 'Not available'
      ])
    });

    doc.save('water-quality-report.pdf');
  }

  downloadExcel() {
    const dataToExport = this.selectedIds.length > 0
      ? this.records.filter(r => this.selectedIds.includes(r.id))
      : this.filteredRecords;

    if (dataToExport.length === 0) {
      alert('No records available to export');
      return;
    }

    const excelData = dataToExport.map(d => ({
      Area: d.area,
      pH: d.ph,
      Turbidity: d.turbidity,
      Temperature: d.temperature,
      Quality: d.quality,
      Usage: d.usage || 'Not available'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = {
      Sheets: { 'Water Data': worksheet },
      SheetNames: ['Water Data']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(file, 'water-quality-report.xlsx');
  }

}
