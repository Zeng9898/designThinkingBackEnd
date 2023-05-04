export class Post {
    id?: number;
    title: string;
    content: string;
    date: Date;

    constructor(title: string, content: string, date: Date) {
        this.title = title;
        this.content = content;
        this.date = date;
    }
}