import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user.model';
import { switchMap } from 'rxjs';
import { PostService } from 'src/services/post/post.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  isLoggedIn!: boolean;
  isAdmin!: boolean;
  isMod!: boolean;
  isMenuOpen = false;
  currentUserId!: string | null;
  userData!: User | null;

  constructor(private authService: AuthService, 
              private postService: PostService, 
              private userService: UserService, 
              private router: Router) {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    });

    this.authService.isAdmin().subscribe((isAdmin: boolean) => {
        this.isAdmin = isAdmin;
    });

    this.authService.isMod().subscribe((isMod: boolean) => {
      this.isMod = isMod;
    });

    this.authService.getCurrentUserId().pipe(
      switchMap((userId) => {
        this.currentUserId = userId;
        return this.postService.getPostsByUserId(userId);
      })
    ).subscribe(() => {
      this.userService.getUserById(this.currentUserId).subscribe((userData) => {
        this.userData = userData;
      });
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  register() {
    this.router.navigate(['/public/registration']);
  }

  login(): void {
    this.router.navigate(['/public/login']);
  }

  logout(): void {
    this.router.navigate(['/public/login']);
    this.authService.logout();
    window.location.reload();
  }

  profile() {
    this.router.navigate(['/private/profile']);
  }

  post() {
    this.router.navigate(['/private/post']);
  }

  feed() {
    this.router.navigate(['/private/feed']);
  }

  follow() {
    this.router.navigate(['/private/follow']);
  }

  rank() {
    this.router.navigate(['/private/rank']);
  }
  
  modifyProfile() {
    this.router.navigate(['/private/modify-profile']);
  }

  adminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  modDashboard() {
    this.router.navigate(['/mod/dashboard']);
  }
}
