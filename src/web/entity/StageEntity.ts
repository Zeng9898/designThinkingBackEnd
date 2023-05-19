import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { DTActivityEntity } from './DTActivityEntity'
import { SubStageEntity } from './SubStageEntity';

@Entity()
export class StageEntity {
    constructor(stageName: string) {
        this.stageName = stageName;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    stageName: string;

    @ManyToOne(() => DTActivityEntity, (dtActivityEntity) => dtActivityEntity.stages)
    dtActivityEntity?: DTActivityEntity;

    @OneToMany(() => SubStageEntity, (subStageEntity) => subStageEntity.stageEntity)
    substages?: SubStageEntity[]
}