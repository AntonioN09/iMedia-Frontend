import { Component, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import { Router } from '@angular/router';
import { MessageService } from 'src/services/message/message.service';
import { Chat } from 'src/models/chat.model';
import { Message } from 'src/models/message.model';

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
  currentChat!: Chat;
  currentLastSeen!: Date | undefined;
  messages!: Observable<any[]>;
  barrierDisplayed!: boolean;

  constructor(public authService: AuthService, 
              public userService: UserService,
              public messageService: MessageService,
              public router: Router) {
    this.currentLastSeen = new Date();
    this.barrierDisplayed = false;
  }

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((userData) => {
          this.userData = userData;
        });
        this.messageService.resetUnseenMessagesOfUser(userId).then();
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

  setReceiverEmail(receiverEmail: string, chat: Chat): void {
    this.receiverEmailSubject.next(receiverEmail);
    this.currentChat = chat;
    this.barrierDisplayed = false;
    this.currentLastSeen = receiverEmail == chat.userEmail1 ? chat.lastSeen2 : chat.lastSeen1;
    this.messageService.updateSeenStatusOfMessages(receiverEmail, chat.id).subscribe();
    this.messageService.updateChat(chat, receiverEmail, this.userData?.avatar).subscribe();
  }

  shouldDisplayBarrier(message: Message): boolean {
    return message.createDate > this.currentLastSeen! && this.currentUserEmail !== message.senderEmail;
  }
}
