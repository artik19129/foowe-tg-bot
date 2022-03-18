import { Rights } from '../enums/rights.enum';

export interface Code {
    id?: number;
    inviteCode: string;
    telegram?: string;
    rights?: Rights;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
