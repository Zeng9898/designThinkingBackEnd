import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import "reflect-metadata";
import { AppDataSource } from "./web/TypeORMConfig";

import { PostController } from './web/controller/PostController';
import { GroupingActitityController } from './web/controller/GroupingActivity';
import { TreeRepository } from 'typeorm';

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log('Datasource initialized successfully');
    })
    .catch((error) => {
        console.log('Datasource initialization failed', error);
    });;

const app = express();

app.use(express.json());

const postController = new PostController();
const groupingActivityController = new GroupingActitityController();



interface User {
    username: string;
    password: string;
}

interface Post {
    username: string;
    title: string;
}

interface AuthenticatedRequest extends Request {
    user: {
        username: string;
    }
}

const users: User[] = [{ username: "billy", password: "123" }];
const posts: Post[] = [{ username: "Noya", title: "first post" },{ username: "billie", title: "second post" }];
app.get('/api/users', (req: Request, res: Response) => {
    res.json(users);
});
app.post('/api/users', async (req: Request, res: Response) => {
    try {
        const user = users.find(user => req.body.username == user.username);
        if (user != undefined) {
            return res.status(400).send('the username has been registered');
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = { username: req.body.username, password: hashedPassword };
            users.push(newUser);
            res.status(201).send();
        }
    }
    catch {
        res.status(500).send();
    }
});
app.post('/api/users/login', async (req: Request, res: Response) => {
    const user = users.find(user => req.body.username == user.username);
    if (user == undefined) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const username = req.body.username;
            const user = { name: username };
            const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET!;
            const accessToken = jwt.sign(user, accessTokenSecret);
            res.json({ accessToken: accessToken });
        } else {
            res.send('Not allowed');
        }
    } catch {
        res.status(500).send();
    }
});
app.get('/api/posts', authenticateToken, (req: Request, res: Response) => {
    res.json(posts.filter(post => post.username === req.currentUser.name));
})
function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (token == undefined) {
        return res.status(401).send('without token');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.status(403).send('not authorized');
        console.log(user);
        req.currentUser = user; // 偷吃步，因為 currentUser 是 any type
        next();
    })
}




app.post('/', postController.createPost);
app.post('/api/groupingActivity', groupingActivityController.createGroupingActivity);

app.listen(3000, () => {
    console.log("Application listening at the http://localhost:3000");
});