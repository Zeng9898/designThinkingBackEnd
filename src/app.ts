import express, { NextFunction, Request, Response } from 'express';

import "reflect-metadata";
import { AppDataSource } from "./web/TypeORMConfig";

import { PostController } from './web/controller/PostController';
import { GroupingActitityController } from './web/controller/GroupingActivity';

const app = express();

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Datasource initialized successfully');
    })
    .catch((error) => {
        console.log('Datasource initialization failed', error);
    });;

const postController = new PostController();
const groupingActivityController = new GroupingActitityController();

app.post('/', postController.createPost);
app.post('/api/groupingActivity', groupingActivityController.createGroupingActivity);

app.listen(3000, () => {
    console.log("Application listening at the http://localhost:3000");
});