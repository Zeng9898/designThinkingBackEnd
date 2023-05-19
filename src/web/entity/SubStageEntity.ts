import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { StageEntity } from './StageEntity';
import { ThinkingRoutineEntity } from './ThinkingRoutineEntity';

@Entity()
export class SubStageEntity {
    constructor(subStageName: string, subStageHint: string, isComplete: boolean) {
        this.subStageName = subStageName;
        this.subStageHint = subStageHint;
        this.isComplete = isComplete;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    subStageName: string;

    @Column()
    subStageHint: string;

    @Column()
    isComplete: boolean;

    @ManyToOne(() => StageEntity, (stageEntity) => stageEntity.substages)
    stageEntity?: StageEntity;

    @OneToMany
    (() => ThinkingRoutineEntity, (thinkingRoutineEntity) => thinkingRoutineEntity.subStageEntity)
    thinkingRoutines?: ThinkingRoutineEntity[]
}