import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, User } from './user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Welcome, {{ currentUser?.name }}</h1>
      <div class="stats">
        <div class="stat-card">
          <span class="label">Total Users</span>
          <span class="value">{{ users.length }}</span>
        </div>
        <div class="stat-card">
          <span class="label">Active</span>
          <span class="value">{{ activeCount }}</span>
        </div>
      </div>
      <button (click)="refreshData()">Refresh</button>
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  currentUser: User | null = null;
  activeCount = 0;

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadData();
    this.subscribeToCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load users from service
  private loadData(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        this.calculateActiveCount();
      });
  }

  // Subscribe to current user changes
  private subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  // Calculate active users
  private calculateActiveCount(): void {
    this.activeCount = this.users.filter((u) => u.role !== 'guest').length;
  }

  // Refresh data manually
  refreshData(): void {
    this.loadData();
  }
}
