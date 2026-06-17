<!--
=============================================================
  DAY 2 ASSIGNMENT — TaskListView.vue (Parent Component)
  This file renders a list of TaskCard components.
=============================================================
-->
<script setup>
import { ref } from 'vue'
import TaskCard from '../../components/Day2/TaskCard_Task2.vue'

// TODO 1: Create a ref() tasks array with at least 3 sample tasks
// Each task: { id, name, done, dueDate }
const tasks = ref([
  { id: 1, name: 'Review Vue 3 Documentation', done: false, dueDate: 'Today', priority: 'high' },
  { id: 2, name: 'Complete Day 2 Assignment', done: false, dueDate: 'Tomorrow', priority: 'medium' },
  { id: 3, name: 'Prepare for code review', done: false, dueDate: 'Next Monday', priority: 'medium' },
  { id: 4, name: 'Prepare for final code interview', done: false, dueDate: 'Next Wednesday', priority: 'high' },
  { id: 5, name: 'Install new dependencies', done: false, dueDate: 'Next Friday', priority: 'low' },
])

// TODO 2: Write handleComplete(id) — toggle the done state of the task with this id
function handleComplete(id) {
  const taskToUpdate = tasks.value.find(task => task.id === id)
  if (taskToUpdate) {
    taskToUpdate.done = !taskToUpdate.done
  }
}

// TODO 3: Write handleDelete(id) — remove the task with this id from the array
function handleDelete(id) {
  tasks.value = tasks.value.filter(task => task.id !== id)
}

// EXTENSION: Handle "update" event to modify task name in parent state
function handleUpdate({ id, newName }) {
  const taskToUpdate = tasks.value.find(task => task.id === id)
  if (taskToUpdate) {
    taskToUpdate.name = newName
  }
}
</script>

<template>
  <div class="task-list-view">
    <h1>My Tasks</h1>

    <div v-if="tasks.length > 0">

      <!-- EXTENSION: Listen for update event from child -->
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :priority="task.priority"
        @complete="handleComplete"
        @delete="handleDelete"
        @update="handleUpdate"
      >
        <template #meta>
          Due: {{ task.dueDate }}
        </template>
      </TaskCard>
    </div>

    <div v-else class="empty-message">
      No tasks!
    </div>
  </div>
</template>

<style scoped>
.task-list-view {
  max-width: 520px;
  margin: 40px auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}
h1 { color: #1B2A4A; margin-bottom: 24px; }
.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}
</style>