export interface Post {
    id?: string;
    title?: string;
    body?: string;
    likes?: number;
    userId?: string;
    userAvatar?: string;
    userEmail?: string | null;
    createDate?: Date;
    numComments?: Number;
    editing?: boolean;
}