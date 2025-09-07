export interface User {
    id: string;
    email: string;
    profile: {
        username: string,
        dateOfBirth: Date,
        fullName: string
    }
} 