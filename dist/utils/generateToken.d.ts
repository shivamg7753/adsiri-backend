interface UserData {
    id: string;
    email: string;
    role: string;
}
export declare const generateToken: (userData: UserData) => string;
export {};
