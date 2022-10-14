import { Mongo } from 'meteor/mongo';

// declares a new Mongo collection for tasks
export const TasksCollection = new Mongo.Collection('tasks');
