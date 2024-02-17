import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import html2pdf from 'html2pdf.js';
import { CV } from 'src/models/cv.model';
import { User } from 'src/models/user.model';

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
  cvData: CV | null = null;
  userData: User | null = null;
  
  constructor(public authService: AuthService, public userService: UserService) {}

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
        this.userService.getCvByUserId(this.userId).subscribe((cvData) => {
          this.cvData = cvData;
        });
        
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