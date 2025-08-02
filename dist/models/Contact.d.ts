import { Model, Optional } from 'sequelize';
export interface ContactAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    service: 'seo' | 'social-media' | 'ppc' | 'content' | 'email' | 'other';
    message: string;
    company?: string;
    website?: string;
    budget?: string;
    timeline?: string;
    status: 'new' | 'replied' | 'in-progress' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}
export interface ContactCreationAttributes extends Optional<ContactAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
}
declare class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    service: 'seo' | 'social-media' | 'ppc' | 'content' | 'email' | 'other';
    message: string;
    company?: string;
    website?: string;
    budget?: string;
    timeline?: string;
    status: 'new' | 'replied' | 'in-progress' | 'closed';
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Contact;
