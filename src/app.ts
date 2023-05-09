import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "./web/TypeORMConfig";

import { PostController } from './web/controller/PostController';
import { GroupingActitityController } from './web/controller/GroupingActivityController';
import { UserController } from './web/controller/UserController';
import { UserRepositoryImpl } from './web/repository/UserRepository';
import { UserUseCases } from './application/UserUseCases';



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


const userRepositoryImpl = new UserRepositoryImpl();
const userUseCases = new UserUseCases(userRepositoryImpl);
const userController = new UserController(userUseCases);
app.post('/api/register', userController.register.bind(userController));
app.post('/api/login', userController.login.bind(userController));

// import implemented class
// 丟給 use case
app.post('/', postController.createPost);
app.post('/api/groupingActivity', groupingActivityController.createGroupingActivity);

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (token == undefined) {
        return res.status(401).send('without token');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403);
        console.log(user);
        req.currentUser = user; // 偷吃步，因為 currentUser 是 any type
        next();
    })
}

app.listen(3000, () => {
    console.log("Application listening at the http://localhost:3000");
});


// interface User {
//     username: string;
//     password: string;
// }

// interface Post {
//     username: string;
//     title: string;
// }

// interface AuthenticatedRequest extends Request {
//     user: {
//         username: string;
//     }
// }
// const users: User[] = [{ username: "billy", password: "123" }];
// const refreshTokens: string[] = [];
// const posts: Post[] = [{ username: "Noya", title: "first post" }, { username: "billie", title: "second post" }];
// app.post('/api/users/login', async (req: Request, res: Response) => {
//     const user = users.find(user => req.body.username == user.username);
//     if (user == undefined) {
//         return res.status(400).send('Cannot find user');
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             const username = req.body.username;
//             const user = { name: username };
//             const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15s' })
//             const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!)
//             refreshTokens.push(refreshToken)
//             res.json({ accessToken: accessToken, refreshToken: refreshToken })
//         } else {
//             res.send('Not allowed');
//         }
//     } catch {
//         res.status(500).send();
//     }
// });
app.get('/api/posts', authenticateToken, (req: Request, res: Response) => {
    res.json({ msg: 'authorized'});
})

// app.post('/api/token', (req: Request, res: Response) => {
//     const refreshToken = req.body.token;
//     if (refreshToken == undefined) return res.sendStatus(401);
//     if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
//     jwt.verify(refreshToken as string, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
//         if (err) return res.sendStatus(403)
//         if (typeof user === "object" && user !== null && "name" in user) {
//             const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15s' })
//             return res.json({ accessToken: accessToken })
//         }
//         res.sendStatus(403);
//     })
// })