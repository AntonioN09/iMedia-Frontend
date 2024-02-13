import { Component, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import { Router } from '@angular/router';
import { MessageService } from 'src/services/message/message.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  chats!: Observable<any[]>;
  userId!: string | null;
  currentUserEmail!: string | null;
  userData!: User | null;
  receiverEmail!: string;
  receiverEmailSubject: Subject<string> = new Subject<string>();
  messages!: Observable<any[]>;

  constructor(public authService: AuthService, 
              public userService: UserService,
              public messageService: MessageService,
              public router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });

    this.receiverEmailSubject.subscribe(receiverEmail => {
      this.receiverEmail = receiverEmail;
    });

    this.authService.getCurrentUserEmail().subscribe((currentUserEmail) => {
      this.currentUserEmail = currentUserEmail;
      if (currentUserEmail) {
        this.chats = this.messageService.getChatsSortedByLatestMessage(currentUserEmail);
        combineLatest([this.receiverEmailSubject, of(currentUserEmail)]).pipe(
          switchMap(([receiverEmail, currentUserEmail]) => {
            return this.messageService.getChatMessagesByUserEmail(receiverEmail, currentUserEmail);
          })
        ).subscribe(messages => {
          this.messages = of(messages);
        });
      } else {
        console.log('User not authenticated');
      }
    });
  }

  setReceiverEmail(receiverEmail: string, chatId: string): void {
    this.receiverEmailSubject.next(receiverEmail);
    this.messageService.updateLatestMessage(chatId).subscribe();
  }
}
