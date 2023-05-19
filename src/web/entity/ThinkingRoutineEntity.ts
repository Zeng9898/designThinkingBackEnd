import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { SubStageEntity } from './SubStageEntity';
import { UserEntity } from './UserEntity';

type RoutineType = '發散' | '收斂';
type BelongColumn = '待排程' | '進行中' | '待審核' | '已完成'

@Entity()
export class ThinkingRoutineEntity {
    constructor(thinkingRoutineName: string, routineType: string, belongColumn: string, needChecked: boolean, index: number) {
        this.thinkingRoutineName = thinkingRoutineName;
        this.routineType = routineType;
        this.belongColumn = belongColumn;
        this.needChecked = needChecked;
        this.index = index
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    thinkingRoutineName: string;

    @Column()
    routineType: string;

    @Column()
    belongColumn: string;

    @Column()
    needChecked: boolean;

    @Column()
    index: number;

    @ManyToOne(() => SubStageEntity, (subStageEntity) => subStageEntity.thinkingRoutines)
    subStageEntity?: SubStageEntity;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    assignees?: UserEntity[]
}