export interface Post {
    id?: string;
    title?: string;
    body?: string;
    likes?: number;
    userId?: string;
    userEmail?: string | null;
    createDate?: Date;
    formattedDate?: string;
    editing?: boolean;
}