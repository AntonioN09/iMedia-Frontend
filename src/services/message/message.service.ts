import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/models/message.model';

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

  addMessage(message: Message): Promise<void> {
    return this.firestore.collection('messages').add(message).then(() => {});
  }
}
