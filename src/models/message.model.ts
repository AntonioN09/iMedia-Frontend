export interface Message {
    id?: string;
    subject?: string;
    body?: string;
    userId?: string | null;
    userAvatar?: string;
    senderEmail?: string | null;
    receiverEmail?: string | null;
    createDate: Date;
}