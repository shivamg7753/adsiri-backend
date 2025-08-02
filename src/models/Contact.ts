import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

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

export interface ContactCreationAttributes extends Optional<ContactAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone?: string;
  public service!: 'seo' | 'social-media' | 'ppc' | 'content' | 'email' | 'other';
  public message!: string;
  public company?: string;
  public website?: string;
  public budget?: string;
  public timeline?: string;
  public status!: 'new' | 'replied' | 'in-progress' | 'closed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    service: {
      type: DataTypes.ENUM('seo', 'social-media', 'ppc', 'content', 'email', 'other'),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    budget: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    timeline: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('new', 'replied', 'in-progress', 'closed'),
      allowNull: false,
      defaultValue: 'new',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'contacts',
    timestamps: true,
  }
);

export default Contact; 