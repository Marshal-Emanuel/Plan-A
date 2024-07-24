import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  profileIcon: string = '/assets/icons/profile.png';
  showDropdown = false;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const userRole = localStorage.getItem('role');
    this.isLoggedIn = !!localStorage.getItem('userId') && userRole === 'user';
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}