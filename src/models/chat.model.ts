export interface Chat {
    id?: string;
    userEmail1?: string | null;
    userEmail2?: string | null;
    userAvatar1?: string;
    userAvatar2?: string;
    userEmails: (string | null)[];
    latestMessage?: Date;
}