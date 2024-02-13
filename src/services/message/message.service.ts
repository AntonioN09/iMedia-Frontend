import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { Chat } from 'src/models/chat.model';
import { Message } from 'src/models/message.model';
import { Notification } from 'src/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  constructor(private firestore: AngularFirestore) {}

  getReceivedMessagesByUserEmail(receiverEmail: string): Observable<any[]> {
      return this.firestore
        .collection<Message>('messages', (ref) => ref.where('receiverEmail', '==', receiverEmail).orderBy('createDate', 'desc'))
        .valueChanges({ idField: 'id' });
  }

  getChatMessagesByUserEmail(senderEmail: string, receiverEmail: string): Observable<any[]> {
    const emails = [senderEmail, receiverEmail];
    return this.firestore
      .collection<Message>('messages', ref =>
        ref.where('senderEmail', 'in', emails)
           .where('receiverEmail', 'in', emails)
           .orderBy('createDate', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  getReceivedNotificationsByUserEmail(receiverEmail: string): Observable<any[]> {
    return this.firestore
      .collection<Notification>('notifications', (ref) => ref.where('receiverEmail', '==', receiverEmail).orderBy('createDate', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  addMessage(message: Message): Promise<void> {
    return this.firestore.collection('messages').add(message).then();
  }

  createChat(chat: Chat): Promise<void> {
    return this.firestore.collection('chats').add(chat).then();
  }

  getChatByUserEmails(userEmail1: string | null, userEmail2: string | null): Observable<Chat | undefined> {
    return this.firestore.collection<Chat>('chats', ref => {
      return ref.where('userEmail1', 'in', [userEmail1, userEmail2])
                .where('userEmail2', 'in', [userEmail1, userEmail2])
                .limit(1);
    }).valueChanges({ idField: 'id' }).pipe(
      map(chats => chats.length > 0 ? chats[0] : undefined)
    );
  }

  getChatsSortedByLatestMessage(userEmail: string): Observable<any[]> {
    return this.firestore
      .collection<Chat>('chats', (ref) => ref.where('userEmails', 'array-contains', userEmail).orderBy('latestMessage', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  updateLatestMessage(chatId: string): Observable<void> {
    return this.firestore.collection('chats').doc(chatId).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          return this.firestore.collection('chats').doc(chatId).update({
            latestMessage: new Date()
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }
}
