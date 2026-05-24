import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WaterService } from '../../water';

@Component({
  selector: 'app-admin-recycle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-recycle.html',
  styleUrls: ['./admin-recycle.css']
})

export class AdminRecycleComponent implements OnInit {

  users: any[] = [];

  loading = true;

  constructor(
    private service: WaterService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadRecycleUsers();

  }

  loadRecycleUsers(): void {

    this.loading = true;

    this.service.getRecycleUsers().subscribe({

      next: (res: any) => {

        this.users = res || [];

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  restoreUser(id: any): void {

    if(confirm('Restore this user?')) {

      this.service.restoreUser(id).subscribe(() => {

        this.loadRecycleUsers();

      });

    }

  }

  logout(): void {

    localStorage.clear();

    this.router.navigate(['/']);

  }

}
