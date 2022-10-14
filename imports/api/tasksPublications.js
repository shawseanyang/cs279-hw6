import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';
// Publications send data to the client; here only the tasks owned by the current user are sent
Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});
