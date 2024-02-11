import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  messages!: Observable<any[]>;
  userId!: string | null;
  userData!: User | null;

  constructor(private authService: AuthService, private messageService: MessageService, private userService: UserService) {}

  ngOnInit() {
    this.authService.getCurrentUserEmail().subscribe((currentUserEmail) => {
      if (currentUserEmail) {
        this.messages = this.messageService.getReceivedMessagesByUserEmail(currentUserEmail);
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
      }
    });
  }

  displayAvatar(userId: string | null): Observable<string | undefined> {
    return this.userService.getUserById(userId).pipe(
      map((userData) => userData?.avatar)
    );
  }
}
