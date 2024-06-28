import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../../database/db';

export enum ROLE {
    DIRECTOR = "director",
    HR = "human resource",
    TEAM_LEAD = "team lead",
    EMPLOYEE = "employee",
}

export enum JOB_TITLE {
    DIRECTOR = "director",
    UI_UX = "user experience and user research",
    SOFTWARE_ENGINEER = "software engineer",
    QA = "quality assurance",
    MARKETER = "marketer",
    PM = "project manager",
    DATA_ANALYST = "data analyst",
    NETWORK_ENGINEER = "network engineer",
    DATABASE_ADMIN = "database admin",
    IT_SUPPORT = "it support",
    ONBOARDING = "onboarding",
    HR = "human resource",
}

export enum DEPARTMENT {
    MANAGEMENT = "management",
    AUDIT = "audit",
    DEVELOPMENT = "software development",
    FINANCE = "finance",
    HR = "human resource",
    IT = "information technology",
    MARKETING = "marketing",
    OPERATIONS = "operations",
    SALES = "sales",
    DESIGN = "design",
    ONBOARDING = "onboarding",
}

export enum EMPLOYMENT_STATUS {
    INTERN = "intern",
    CONTRACT = "contract",
    FULLTIME = "full time",
    PARTIME = "part time",
    TERMINATED = "terminated",
    RESIGNED = "resigned",
    ONBOARDING = "onboarding",
}

export enum WORK_TYPE {
    REMOTE = "remote",
    ONSITE = "onsite",
    HYBRID = "hybrid",
    ONBOARDING = "onboarding",
}

export interface Location {
    address: string;
    city: string;
    state: string;
    zip: number;
}

export interface Schedule {
    startTime: string;
    endTime: string;
    workDays: string[];
    workSchedule: string;
    workType: WORK_TYPE;
    workLocation: string;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
}

export interface EmergencyContacts {
    contact: EmergencyContact[];
}

export interface CompensationDetails {
    bankName: string;
    accountNumber: string;
    accountName: string;
    salary: string;
}

export interface Employment {
    department: DEPARTMENT;
    jobTitle: JOB_TITLE;
    status: EMPLOYMENT_STATUS;
    isEmployee: boolean;
    isTeamLead: boolean;
    employeeId: string;
    preferredName: string;
    dateOfEmployment: Date;
    dateOfBirth: Date;
    schedule: Schedule;
    compensationDetails: CompensationDetails;
    location: Location;
    emergencyContacts: EmergencyContacts;
}

export interface Login {
    loginCount: number;
    loginRetrieval: number;
    resetPasswordExpiration?: number | null;
    resetPasswordStatus?: boolean;
    resetPasswordCode: string | null;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    email: string;
    phone: string;
    password: string;
    login: Login;
    role: ROLE;
    employment: Employment;
    imageUrl: string;
    createdAt?: Date;
}

export class UserModel extends Model<User> {}

UserModel.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(ROLE)),
            allowNull: false,
        },
        login: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {
                loginCount: 0,
                loginRetrieval: 0,
                resetPasswordExpiration: null,
                resetPasswordStatus: false,
                resetPasswordCode: null,
            },
        },
        employment: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {
                department: DEPARTMENT.ONBOARDING,
                jobTitle: JOB_TITLE.ONBOARDING,
                status: EMPLOYMENT_STATUS.ONBOARDING,
                isEmployee: true,
                isTeamLead: false,
                employeeId: '',
                preferredName: '',
                dateOfEmployment: new Date(),
                dateOfBirth: new Date(),
                schedule: {
                    startTime: '',
                    endTime: '',
                    workDays: [],
                    workSchedule: '',
                    workType: WORK_TYPE.ONBOARDING,
                    workLocation: '',
                },
                compensationDetails: {
                    bankName: '',
                    accountNumber: '',
                    accountName: '',
                    salary: '',
                },
                location: {
                    address: '',
                    city: '',
                    state: '',
                    zip: 0,
                },
                emergencyContacts: {
                    contact: [],
                },
            },
        },
    },
    { 
        sequelize: db, 
        tableName: "user",
        timestamps: true,
    }
);
