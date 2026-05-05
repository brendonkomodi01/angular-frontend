import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (token: string) => {
        this.authService.saveToken(token);
        this.router.navigate(['/slot']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password!';
      }
    });
  }
}
