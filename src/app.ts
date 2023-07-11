import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import os from 'os';
dotenv.config();
// packages for database
import "reflect-metadata";
import { AppDataSource } from "./web/TypeORMConfig";
// modules that clean architecutre needs
import { PostController } from './web/controller/PostController';
import { GroupingActitityController } from './web/controller/GroupingActivityController';
import { UserController } from './web/controller/UserController';
import { UserRepositoryImpl } from './web/repository/UserRepository';
import { UserUseCases } from './application/UserUseCases';
import { DesignThinkingActivityController } from './web/controller/DesignThinkingActivityController';
import { DesignThinkingActivityRepositoryIpml } from './web/repository/DesignThinkingActivityRepository';
import { DesignThinkingActivityUseCases } from './application/DesignThinkinActivityUseCases';
import { IdeaRepositoryImpl } from './web/repository/IdeaRepository';
import { IdeaUseCases } from './application/IdeaUseCases';
import { ThinkingRoutineEntity } from './web/entity/ThinkingRoutineEntity';
import { ThinkingRoutineRepositoryIpml } from './web/repository/ThinkingRoutineRepository';
import { ThinkingRoutineUseCases } from './application/ThinkingRoutineUseCases';
import { ThinkinRoutineController } from './web/controller/ThinkingRoutineController';


AppDataSource.initialize()
    .then(() => {
        console.log('Datasource initialized successfully');
    })
    .catch((error) => {
        console.log('Datasource initialization failed', error);
    });

// set up server and socket.io
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'PUT', 'POST'],
    credentials: true
}));

httpServer.listen(3000, () => {
    const address = httpServer.address() as any;
    const ipAddress = getLocalIpAddress();
    console.log(`Server listening on ${ipAddress}:${address.port}`);
});

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const addresses = interfaces[interfaceName];
        if (addresses) {
            for (const address of addresses) {
                if (address.family === 'IPv4' && !address.internal) {
                    return address.address;
                }
            }
        }
    }
    return 'localhost'; // Fallback to localhost if no IP address found
}
// cors and json request parsing
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
app.use(express.json());

const ideaRepositoryImpl = new IdeaRepositoryImpl();
const ideaUseCases = new IdeaUseCases(ideaRepositoryImpl);

io.on('connection', socket => {
    console.log(socket.id);
    socket.on("updateBoard", cards => {
        socket.broadcast.emit("updateBoard", cards)
        //console.log(message);
    })
    socket.on('join-room', room => {
        console.log(`someone join room ${room}`)
        socket.join(room);
    })
    socket.on('leave-room', room => {
        console.log(`someone leave room ${room}`)
        socket.leave(room);
    })
    socket.on('createNode', async (room, node) => {
        try {
            console.log(typeof room, room)
            if (room === "") {
                socket.emit('nodeUpdated', 'no room provided');
            } else {
                // Perform some operations and handle errors if they occur
                if (!node.title || !node.owner || !node.thinkingRoutineId || !node.content) {
                    const errorMessage = 'lack of parameter for creating node.';
                    socket.to(room).emit('errorEvent', errorMessage);
                } else {
                    const nullNumber: number = 0;
                    if (node.to === null)
                        await ideaUseCases.create(node.title, node.owner, node.thinkingRoutineId, node.content, nullNumber);
                    else
                        await ideaUseCases.create(node.title, node.owner, node.thinkingRoutineId, node.content, node.to);
                    console.log(room)
                    io.to(room).emit('nodeUpdated', 'updated node successful');
                }
            }
        } catch (error) {
            console.log(error);
            socket.emit('errorEvent', error);
        }
    });
})



// for routing and dependency injection
const postController = new PostController();
const groupingActivityController = new GroupingActitityController();


const userRepositoryImpl = new UserRepositoryImpl();
const userUseCases = new UserUseCases(userRepositoryImpl);
const userController = new UserController(userUseCases);
app.post('/api/register', userController.register.bind(userController));
app.post('/api/login', userController.login.bind(userController));

const designThinkingActivityRepositoryIpml = new DesignThinkingActivityRepositoryIpml();
const designThinkingActivityUseCases = new DesignThinkingActivityUseCases(designThinkingActivityRepositoryIpml);
const designThinkingActivityController = new DesignThinkingActivityController(designThinkingActivityUseCases);
app.post('/api/designThinkingActivity', designThinkingActivityController.create.bind(designThinkingActivityController));
app.post('/api/designThinkingActivity/:designThinkingActivityId/users', designThinkingActivityController.joinUser.bind(designThinkingActivityController))
app.get('/api/designThinkingActivity/:designThinkingActivityId', designThinkingActivityController.read.bind(designThinkingActivityController))
app.get('/api/users/:userId/designThinkingActivities', designThinkingActivityController.findDesignThinkingActivityForUser.bind(designThinkingActivityController))

const thinkingRoutineRepositoryIpml = new ThinkingRoutineRepositoryIpml();
const thinkingRoutineUseCases = new ThinkingRoutineUseCases(thinkingRoutineRepositoryIpml);
const thinkingRoutineController = new ThinkinRoutineController(thinkingRoutineUseCases);
app.get('/api/thinkingRoutine/:thinkingRoutineId', thinkingRoutineController.read.bind(thinkingRoutineController));


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
    res.json({ msg: 'authorized' });
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