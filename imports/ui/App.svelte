<script>
  import { TasksCollection } from '../db/TasksCollection';
  import { Meteor } from 'meteor/meteor';
  import Task from './Task.svelte';
  import TaskForm from './TaskForm.svelte';
  import LoginForm from './LoginForm.svelte';

  // the central component of the frontend

  let hideCompleted = false;
  const hideCompletedFilter = { isChecked: { $ne: true } };

  let incompleteCount;
  let pendingTasksTitle = '';
  let tasks = [];
  let user = null;
  let isLoading = true;

  // subscribe to the tasks collection
  const handler = Meteor.subscribe('tasks');
  // get the tasks from the collection and store it in a reactive variable
  $m: {
    user = Meteor.user();

    if (user) {
        
        isLoading = !handler.ready();
        
        // only show the tasks of the current user
        const userFilter = { userId: user._id };
        // if the hideCompleted checkbox is checked, only show the incomplete tasks
        const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

        // get the tasks from the collection
        // with the filters above
        // sorted by creation date
        tasks = TasksCollection.find(
                hideCompleted ? pendingOnlyFilter : userFilter,
                { sort: { createdAt: -1 } }
            ).fetch();

        // get the number of incomplete tasks
        incompleteCount = TasksCollection.find(pendingOnlyFilter).count();

        // set the title of the page to be the number of pending tasks
        pendingTasksTitle = `${
          incompleteCount ? ` (${incompleteCount})` : ''
        }`;
    }
  }

  // set the value of hideCompleted
  const setHideCompleted = value => {
    hideCompleted = value;
  };

  // logout command
  const logout = () => Meteor.logout();
</script>


<div class="app">
    <header>
        <div class="app-bar">
            <!-- Show the number of pending tasks beside the title -->
            <div class="app-header">
                <h1>📝️ To Do List {pendingTasksTitle}</h1>
            </div>
        </div>
    </header>

    <div class="main">
        <!-- if the user is logged in, show the tasks; otherwise show the login screen -->
        {#if user}
            <!-- show current user; logout on click -->
            <div class="user" on:click={logout}>
                {user.username} 🚪
            </div>

            <!-- Form to enter new tasks -->
            <TaskForm />

            <!-- Filter to hide completed tasks -->
            <div class="filter">
                <button on:click={() => setHideCompleted(!hideCompleted)}>
                    {hideCompleted ? 'Show All' : 'Hide Completed'}
                </button>
            </div>

            <!-- show loading if loading-->
            {#if isLoading}
                <div class="loading">loading...</div>
            {/if}

            <!-- show tasks -->
            <ul class="tasks">
              {#each tasks as task (task._id)}
                  <Task task={task} />
              {/each}
            </ul>
        {:else}
            <LoginForm />
        {/if}
    </div>
</div>
