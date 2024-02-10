import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {
  @ViewChild('cvContainer', { static: true }) cvContainer!: ElementRef;
  userId: string | null = null;
  userEmail: string | null = null;
  username: string | null = null;
  userData: User | null = null;
  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((email) => {
      this.userEmail = email;
    });

    this.authService.getCurrentUsername().subscribe((username) => {
      this.username = username;
    });

    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });
  }

  exportPdf(): void {
    const cvElement = this.cvContainer.nativeElement;
    html2pdf()
      .from(cvElement)
      .save();
  }
}