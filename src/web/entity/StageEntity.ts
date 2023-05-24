import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { DTActivityEntity } from './DTActivityEntity'
import { SubStageEntity } from './SubStageEntity';

@Entity()
export class StageEntity {
    constructor(stageName: string, dtActivityEntity: DTActivityEntity) {
        this.stageName = stageName;
        this.dtActivityEntity = dtActivityEntity;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    stageName: string;

    @ManyToOne(() => DTActivityEntity, (dtActivityEntity) => dtActivityEntity.stages)
    dtActivityEntity: DTActivityEntity;

    @OneToMany(() => SubStageEntity, (subStageEntity) => subStageEntity.stageEntity)
    substages?: SubStageEntity[]
}