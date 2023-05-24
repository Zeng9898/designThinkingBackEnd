import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, AfterLoad, OneToOne, JoinColumn } from 'typeorm';
import { SubStageEntity } from './SubStageEntity';
import { UserEntity } from './UserEntity';
import { ThinkingRoutineEntity } from './ThinkingRoutineEntity';

@Entity()
export class IdeaEntity {
    constructor(title: string, content: string, owner: UserEntity) {
        this.title = title;
        this.content = content;
        this.owner = owner;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.ideas)
    owner: UserEntity;

    // @OneToOne(() => IdeaEntity)
    // @JoinColumn()
    // to?: IdeaEntity;

    @ManyToMany(() => IdeaEntity)
    @JoinTable()
    to?: IdeaEntity[];

    @ManyToOne(() => ThinkingRoutineEntity, (thinkingRoutineEntity) => thinkingRoutineEntity.ideas)
    thinkingRoutineEntity?: ThinkingRoutineEntity;
}