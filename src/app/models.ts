// export type FirestoreTimestamp = import("firebase").firestore.Timestamp;

export interface AwardCategory {
    award: string;
    points: number;
    nominees: Nominee[];
    winner: string;
    winnerStamp: any;
    // winnerStamp: FirestoreTimestamp;
    id: string;
}

export interface Nominee {
    film: string;
    nominee: string;
    id: string;
}

export interface OscarUser {
    uid: string;
    displayName: string;
    photoURL: string;
    picks: {
        [key: string]: Nominee;
    };
    points: number;
    gotLastAwardCorrect: boolean;
}

export interface Pool {
    id: string;
    name: string;
    creator: string;
    dateCreated: any;
    // dateCreated: FirestoreTimestamp;
    users: string[];
}