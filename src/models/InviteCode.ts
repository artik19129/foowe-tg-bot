import { DataTypes, Model, Op, Optional } from 'sequelize';
import sequelizeConnection from '../config';
import { Rights } from '../enums/rights.enum';
import { Code } from '../interfaces/code.interface';

interface InviteCodeAttributes {
    id: number;
    inviteCode: string;
    telegram?: string;
    rights?: Rights;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InviteCodeInput extends Optional<InviteCodeAttributes, 'id' | 'inviteCode' | 'telegram'> {
}

export interface InviteCodeOutput extends Required<InviteCodeAttributes> {
}

class InviteCode extends Model<InviteCodeAttributes, InviteCodeInput> implements InviteCodeAttributes {
    public id!: number;
    public inviteCode!: string;
    public telegram!: string;
    public rights?: Rights;
    public status!: boolean;


    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static async createCode(data: Code) {
        return this.create(data);
    }

    static async getCodes() {
        return this.findAll();
    }

    static async checkCode(inviteCode: number) {
        return this.findOne({
            where: {
                inviteCode,
                status: {
                    [Op.ne]: 1,
                },

            },
        });
    }

    static async activateCode(id: number, telegram: string) {
        return this.update({
            status: true,
            telegram
        }, {
            where: {
                id,
            },
        });
    }
}

InviteCode.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    telegram: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: null,
    },
    inviteCode: {
        type: DataTypes.STRING,
        unique: true,
    },
    rights: {
        type: DataTypes.ENUM(
            'guest',
            'user',
            'admin',
            'developer',
        ),
        defaultValue: 'guest',
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'invite_codes',
    timestamps: true,
    sequelize: sequelizeConnection,
});

export default InviteCode;
