import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.errorMessage = 'Registration failed. Username may already exist.';
      }
    });
  }
}
