import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { Chat } from 'src/models/chat.model';
import { Message } from 'src/models/message.model';
import { Notification } from 'src/models/notification.model';
import { User } from 'src/models/user.model';

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

  incrementUnseenMessagesOfUser(user: User | null): Promise<void> {
    if (!user || !user.id) {
      return Promise.reject('Invalid user');
    }
    
    return this.firestore.collection('users').doc(user.id).get().toPromise()
      .then((doc) => {
        if (doc?.exists) {
          const current = (doc.data() as User)?.unseenMessages || 0;
          const updated = current + 1;
          return this.firestore.collection('users').doc(user.id).update({
            unseenMessages: updated,
          });
        } else {
          return Promise.reject('Document not found');
        }
      });
  }

  resetUnseenMessagesOfUser(userId: string | null): Promise<any> {
    return this.firestore.collection('users').doc(userId!).get().toPromise()
      .then((doc) => {
        if (doc?.exists) {
          return this.firestore.collection('users').doc(userId!).update({
            unseenMessages: 0,
          });
        } else {
          return Promise.reject('Document not found');
        }
      });
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

  updateChat(chat: Chat, receiverEmail: string, userAvatar: string | undefined): Observable<void> {
    const userAvatar1 = receiverEmail == chat.userEmail1 ? userAvatar : chat.userAvatar1;
    const userAvatar2 = receiverEmail == chat.userEmail2 ? userAvatar : chat.userAvatar2;
    const unseenMessages1 = receiverEmail == chat.userEmail1 ? chat.unseenMessages1 : 0;
    const unseenMessages2 = receiverEmail == chat.userEmail2 ? chat.unseenMessages2 : 0;
    const lastSeen1 = receiverEmail == chat.userEmail1 ? chat.lastSeen1 : new Date();
    const lastSeen2 = receiverEmail == chat.userEmail2 ? chat.lastSeen2 : new Date();
    return this.firestore.collection('chats').doc(chat.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          return this.firestore.collection('chats').doc(chat.id).update({
            userAvatar1: userAvatar1,
            userAvatar2: userAvatar2,
            unseenMessages1: unseenMessages1,
            unseenMessages2: unseenMessages2,
            lastSeen1: lastSeen1,
            lastSeen2: lastSeen2
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  incrementNumberOfUnseenMessages(chat: Chat, receiverEmail: string | undefined): Observable<void> {
    if(chat.userEmail1 == receiverEmail){
      return this.firestore.collection('chats').doc(chat.id).get().pipe(
        switchMap((doc) => {
          if (doc.exists) {
            const current1 = (doc.data() as Chat)?.unseenMessages1 || 0;
            const updated1 = current1 + 1;
            return this.firestore.collection('chats').doc(chat.id).update({
              latestMessage: new Date(),
              unseenMessages1: updated1,
            });
          } else {
            return Promise.reject('Document not found');
          }
        })
      );
    }
    return this.firestore.collection('chats').doc(chat.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          const current2 = (doc.data() as Chat)?.unseenMessages2 || 0;
          const updated2 = current2 + 1;
          return this.firestore.collection('chats').doc(chat.id).update({
            latestMessage: new Date(),
            unseenMessages2: updated2
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  updateSeenStatusOfMessages(receiverEmail: string | undefined, chatId: string | undefined): Observable<void> {
    if (!receiverEmail || !chatId) {
      return throwError('Invalid receiverEmail or chatId');
    }

    return this.firestore.collection('messages', ref => ref.where('senderEmail', '==', receiverEmail).where('chatId', '==', chatId))
      .get()
      .pipe(
        switchMap(snapshot => {
          const batch = this.firestore.firestore.batch();
          snapshot.docs.forEach(doc => {
            const messageRef = this.firestore.collection('messages').doc(doc.id).ref;
            batch.update(messageRef, { seenStatus: true });
          });
          return batch.commit();
        }),
        catchError(error => {
          console.error('Error updating seenStatus:', error);
          return throwError('Error updating seenStatus');
        })
      );
  }
}
