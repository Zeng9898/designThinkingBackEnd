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

    @OneToOne(() => UserEntity) //這裡的 one-to-one 應該會有問題，因為一個 user 可以當多個活動的組長，所以應該是一對多
    @JoinColumn()
    leader?: UserEntity;

    @OneToMany(() => StageEntity, (stageEntity) => stageEntity.dtActivityEntity)
    stages?: StageEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users?: UserEntity[]
}