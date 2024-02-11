export interface Comment {
    id?: string;
    postId: string;
    body?: string;
    likes?: number;
    userId?: string;
    userAvatar?: string;
    userEmail?: string | null;
    createDate: Date;
    editing?: boolean;
}