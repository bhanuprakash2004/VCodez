import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WaterService } from '../water';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];

  loading = true;
  searchText = '';

  constructor(
    private service: WaterService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUsers();
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.service.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res || [];
        this.filteredUsers = this.users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    const text = this.searchText.toLowerCase();

    this.filteredUsers = this.users.filter(u =>
      (u.username || '').toLowerCase().includes(text) ||
      (u.phone || '').toLowerCase().includes(text) ||
      (u.role || '').toLowerCase().includes(text)
    );
  }

  deleteUser(id: any): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.service.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
