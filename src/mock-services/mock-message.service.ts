import { Observable, of } from 'rxjs';

export class MockMessageService {
  getReceivedMessagesByUserEmail(receiverEmail: string): Observable<any[]> {
    return of([]);
  }

  getChatMessagesByUserEmail(senderEmail: string, receiverEmail: string): Observable<any[]> {
    return of([]);
  }

  getReceivedNotificationsByUserEmail(receiverEmail: string): Observable<any[]> {
    return of([]);
  }

  addMessage(message: any): Promise<void> {
    return Promise.resolve();
  }

  incrementUnseenMessagesOfUser(user: any): Promise<void> {
    return Promise.resolve();
  }

  resetUnseenMessagesOfUser(userId: string | null): Promise<any> {
    return Promise.resolve();
  }

  createChat(chat: any): Promise<void> {
    return Promise.resolve();
  }

  getChatByUserEmails(userEmail1: string | null, userEmail2: string | null): Observable<any> {
    return of(undefined);
  }

  getChatsSortedByLatestMessage(userEmail: string): Observable<any[]> {
    return of([]);
  }

  updateChat(chat: any, receiverEmail: string, userAvatar: string | undefined): Observable<void> {
    return of();
  }

  incrementNumberOfUnseenMessages(chat: any, receiverEmail: string | undefined): Observable<void> {
    return of();
  }

  updateSeenStatusOfMessages(receiverEmail: string | undefined, chatId: string | undefined): Observable<void> {
    return of();
  }
}
