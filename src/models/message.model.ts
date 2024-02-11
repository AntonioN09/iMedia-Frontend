export interface Message {
    id?: string;
    subject?: string;
    body?: string;
    userId?: string | null;
    senderEmail?: string | null;
    receiverEmail?: string | null;
    createDate: Date;
}