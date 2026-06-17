import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [
      { id: 1, name: 'Learn Vue Router', done: false, dueDate: '2026-06-20' },
      { id: 2, name: 'Build a task app', done: false, dueDate: '2026-06-25' },
      { id: 3, name: 'Practice Pinia', done: false, dueDate: '2026-06-30' },
      { id: 4, name: 'Eat Letchon', done: false, dueDate: '2026-07-05' },
    ],
  }),
})