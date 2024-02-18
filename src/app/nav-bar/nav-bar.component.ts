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
  isAdmin!: boolean | null | undefined;
  isMod!: boolean | null | undefined;
  isMenuOpen = false;
  currentUserId!: string | null;
  userData!: User | null;
  isMenuOpenMobile = false;

  constructor(private authService: AuthService, 
              private postService: PostService, 
              private userService: UserService, 
              private router: Router) {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    });

    this.userService.isAdmin().subscribe((isAdmin: boolean | null | undefined) => {
        this.isAdmin = isAdmin;
    });

    this.userService.isMod().subscribe((isMod: boolean | null | undefined) => {
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

  toggleMenuMobile(): void {
    this.isMenuOpenMobile = !this.isMenuOpenMobile;
  }

  register() {
    this.router.navigate(['/public/registration']);
  }

  login(): void {
    this.router.navigate(['/public/login']);
  }

  logout(): void {
    this.authService.logout();
    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if(!isAuthenticated){
        this.router.navigate(['/public/login']);
      }
    });
  }

  profile() {
    this.router.navigate(['/private/profile', this.currentUserId]);
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

  inbox() {
    this.router.navigate(['/private/inbox']);
  }

  cv() {
    this.router.navigate(['/private/cv']);
  }

  modifyCv() {
    this.router.navigate(['/private/modify-cv']);
  }

  notification() {
    this.router.navigate(['/private/notification']);
  }

  adminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  modDashboard() {
    this.router.navigate(['/mod/dashboard']);
  }
}
