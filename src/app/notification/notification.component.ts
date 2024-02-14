import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications!: Observable<any[]>;
  userId!: string | null;
  userData!: User | null;

  constructor(private authService: AuthService, private messageService: MessageService, private userService: UserService) {}

  ngOnInit() {
    this.authService.getCurrentUserEmail().subscribe((currentUserEmail) => {
      if (currentUserEmail) {
        this.notifications = this.messageService.getReceivedNotificationsByUserEmail(currentUserEmail);
      } else {
        console.log('User not authenticated');
      }
    });

    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((userData) => {
          this.userData = userData;
        });

        this.userService.resetUnseenNotifications(this.userId).subscribe();
      }
    });
  }
}
