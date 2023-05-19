import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { StageEntity } from './StageEntity'
import { UserEntity } from './UserEntity';

@Entity()
export class DTActivityEntity {
    constructor(dtActivityName: string) {
        this.dtActivityName = dtActivityName;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    dtActivityName: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    leader?: UserEntity;

    @OneToMany(() => StageEntity, (stageEntity) => stageEntity.dtActivityEntity)
    stages?: StageEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users?: UserEntity[]
}