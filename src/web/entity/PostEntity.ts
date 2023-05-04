import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostEntity {
    constructor(title: string, content: string, date: Date) {
        this.title = title;
        this.content = content;
        this.date = date;
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    date: Date;
}