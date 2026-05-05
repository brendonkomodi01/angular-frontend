import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  private backgroundMusic = new Audio('assets/sounds/background-music.mp3');

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.backgroundMusic.pause();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  startMusic(): void {
    if (this.backgroundMusic.paused) {
      this.backgroundMusic.play();
    }
  }
}
