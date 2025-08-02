interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}
interface ContactData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    service: string;
    company?: string;
    website?: string;
    budget?: string;
    timeline?: string;
    message: string;
    submittedAt?: Date;
}
interface UserData {
    name: string;
    email: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const sendContactNotification: (contactData: ContactData) => Promise<void>;
export declare const sendWelcomeEmail: (userData: UserData) => Promise<void>;
export {};
