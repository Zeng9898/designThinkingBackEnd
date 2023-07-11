import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IdeaEntity } from './IdeaEntity';
import { DTActivityEntity } from './DTActivityEntity';

@Entity()
export class UserEntity {
    constructor(nickname:string, username: string, password: string) {
        this.nickname = nickname;
        this.username = username;
        this.password = password;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    nickname: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @OneToMany
    (() => IdeaEntity, (ideaEntity) => ideaEntity.owner)
    ideas?: IdeaEntity[];

    @OneToMany
    (() => DTActivityEntity, (dtActivityEntity) => dtActivityEntity.leaderShip) //一個設計思考活動有一個組長
    dTActivities?: DTActivityEntity[]
}