import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, AfterLoad, OneToMany } from 'typeorm';
import { SubStageEntity } from './SubStageEntity';
import { UserEntity } from './UserEntity';
import { IdeaEntity } from './IdeaEntity';

type RoutineType = '發散' | '收斂';
type BelongColumn = '待排程' | '進行中' | '待審核' | '已完成'

@Entity()
export class ThinkingRoutineEntity {
    constructor(thinkingRoutineName: string, routineType: string, belongColumn: string, needChecked: boolean, index: number, hint: string, subStageEntity: SubStageEntity) {
        this.thinkingRoutineName = thinkingRoutineName;
        this.routineType = routineType;
        this.belongColumn = belongColumn;
        this.needChecked = needChecked;
        this.index = index;
        this.hint = hint;
        this.subStageEntity = subStageEntity;
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

    @Column()
    hint: string;

    @ManyToOne(() => SubStageEntity, (subStageEntity) => subStageEntity.thinkingRoutines)
    subStageEntity: SubStageEntity;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    assignees?: UserEntity[];

    @OneToMany(() => IdeaEntity, (ideaEntity) => ideaEntity.thinkingRoutineEntity)
    ideas?: IdeaEntity[]

    @AfterLoad()
    assigneesDefault() {
        this.assignees = this.assignees || [];
    }
}