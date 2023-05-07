// this file is use to extend the Request interface with currentUser property
import { Express } from 'express'

declare global {
    namespace Express {
        interface Request {
            currentUser: any
        }
    }
}