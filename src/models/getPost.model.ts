import firebase from 'firebase/compat/app';


export interface getPost {
    id?: string;
    title: string;
    body: string;
    likes: number;
    userId: string;
    userEmail: string | null;
    createDate: firebase.firestore.Timestamp;
}