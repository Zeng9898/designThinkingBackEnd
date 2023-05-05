import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupingActivityEntity {
    constructor(groupingActivityName: string, isSupervised: boolean, supervisorInvitationCode: string, invitationCode:string) {
        this.groupingActivityName = groupingActivityName;
        this.isSupervised = isSupervised;
        this.supervisorInvitationCode = supervisorInvitationCode;
        this.invitationCode = invitationCode;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    groupingActivityName: string;

    @Column()
    isSupervised: boolean;

    @Column()
    supervisorInvitationCode: string;

    @Column()
    invitationCode:string;
}