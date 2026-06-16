<!--
=============================================================
  DAY 1 ASSIGNMENT — Reactive Task Counter App (SOLUTION)
  Topic: Vue 3 Composition API (ref, computed, v-model, v-for)
  
  This solution includes all core requirements plus optional
  extensions: filter bar, "Clear All Done" button, and task
  priority (Low/Medium/High) with a select dropdown.
  
  Each section is annotated with the requirement it fulfills.
=============================================================
-->

<script setup>
import { ref, computed } from 'vue'

/* ========== REACTIVE STATE (ref) ========== */

// Requirement: Use ref() for the text input value (initial empty string)
const newTaskName = ref('')

// Extension: ref for priority dropdown (default 'medium')
const newTaskPriority = ref('medium')

// Requirement: Use ref() for the tasks array (initial empty array)
// Each task: { id, name, done, priority }
const tasks = ref([])

// Extension: ref for active filter ('all', 'pending', 'done')
const activeFilter = ref('all')

// Priority options for the dropdown select
const priorityOptions = [
  { label: 'Low',    value: 'low'    },
  { label: 'Medium', value: 'medium' },
  { label: 'High',   value: 'high'   },
]

// Filter options for the filter bar
const filterOptions = ['all', 'pending', 'done']

/* ========== COMPUTED PROPERTIES (stats & filters) ========== */

// Requirement: Use computed() for total, done, and pending counts
const totalCount   = computed(() => tasks.value.length)
const doneCount    = computed(() => tasks.value.filter(t => t.done).length)
const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

// Extension: Filter tasks based on activeFilter value
const filteredTasks = computed(() => {
  if (activeFilter.value === 'done') {
    return tasks.value.filter(task => task.done)
  }
  if (activeFilter.value === 'pending') {
    return tasks.value.filter(task => !task.done)
  }
  // 'all' filter - pending tasks appear first for better UX
  return [...tasks.value].sort((a, b) => Number(a.done) - Number(b.done))
})

/* ========== ACTIONS (methods) ========== */

// Requirement: addTask() - prevent empty tasks, push new task, clear input
// Also supports @keyup.enter on the input field
function addTask() {
  // Prevent adding empty or whitespace-only tasks (requirement)
  if (!newTaskName.value.trim()) return
  
  // Push a new task object with unique id, name, done: false, and priority
  tasks.value.push({
    id:       Date.now(),               // unique identifier
    name:     newTaskName.value.trim(), // task description
    done:     false,                    // completion status
    priority: newTaskPriority.value,    // extension: low/medium/high
  })
  
  // Clear the input field after adding (requirement)
  newTaskName.value = ''
  // Reset priority to default (optional)
  newTaskPriority.value = 'medium'
}

// Requirement: removeTask(id) - filter out task with matching id
function removeTask(id) {
  tasks.value = tasks.value.filter(task => task.id !== id)
}

// Extension: clear all completed tasks at once
function clearDoneTasks() {
  tasks.value = tasks.value.filter(task => !task.done)
}

// Helper: capitalize first letter for filter labels and priority tags
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="app">
    <h1>Task Counter</h1>

    <!-- ========== ADD TASK SECTION ========== -->
    <!-- Requirement: Input with v-model + @keyup.enter + Add Task button -->
    <div class="input-card">
      <div class="input-row">
        <input
          v-model="newTaskName"
          @keyup.enter="addTask"
          type="text"
          placeholder="What needs to be done?"
          class="task-input"
        />
        <!-- Extension: priority dropdown select -->
        <select v-model="newTaskPriority" class="pri-select">
          <option
            v-for="opt in priorityOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <button @click="addTask" class="btn btn-primary">+ Add Task</button>
      </div>
    </div>

    <!-- ========== STATS BAR ========== -->
    <!-- Requirement: Live stats using computed values (Total | Done | Pending) -->
    <div class="stats">
      <div class="stat">
        <span class="stat-label">Total</span>
        <span class="stat-number">{{ totalCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Done</span>
        <span class="stat-number">{{ doneCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Pending</span>
        <span class="stat-number">{{ pendingCount }}</span>
      </div>
    </div>

    <!-- ========== FILTER BAR (Extension) ========== -->
    <div class="filter-bar">
      <button
        v-for="filter in filterOptions"
        :key="filter"
        :class="['filter-btn', { active: activeFilter === filter }]"
        @click="activeFilter = filter"
      >
        {{ capitalize(filter) }}
      </button>
      <!-- Extension: "Clear All Done" button (only visible if there are done tasks) -->
      <button
        v-if="doneCount > 0"
        @click="clearDoneTasks"
        class="btn btn-clear"
      >
        ✖ Clear Done
      </button>
    </div>

    <!-- ========== TASK LIST ========== -->
    <!-- Requirement: Show empty state message when no tasks -->
    <div v-if="filteredTasks.length === 0" class="empty-state">
      <p v-if="tasks.length === 0">No tasks yet. Add one above!</p>
      <p v-else>No tasks match the current filter.</p>
    </div>

    <!-- Requirement: Render task list using v-for with :key -->
    <ul v-else class="task-list">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-item"
        :class="{ 'task-done': task.done }"
      >
        <!-- Requirement: Checkbox to mark task as done (v-model binds to task.done) -->
        <input type="checkbox" v-model="task.done" class="task-checkbox" />

        <!-- Requirement: Task name with strike-through when done -->
        <span class="task-name" :class="{ 'done-text': task.done }">
          {{ task.name }}
        </span>

        <!-- Extension: Priority tag (Low/Medium/High) with appropriate styling -->
        <span :class="['priority-tag', `priority-${task.priority}`]">
          {{ capitalize(task.priority) }}
        </span>

        <!-- Requirement: Remove button for each task -->
        <button @click="removeTask(task.id)" class="remove-btn" aria-label="Remove task">
          ✕
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Base styles */
.app {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
}

/* Input card */
.input-card {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.task-input {
  flex: 2;
  padding: 0.7rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
}

.task-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.pri-select {
  padding: 0.7rem;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #6366f1;
  color: white;
}

.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

.btn-clear {
  background: #fee2e2;
  color: #dc2626;
  margin-left: auto;
}

.btn-clear:hover {
  background: #fecaca;
}

/* Stats bar */
.stats {
  display: flex;
  justify-content: space-around;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  font-weight: 600;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

/* Filter bar */
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-btn {
  padding: 0.4rem 1rem;
  border-radius: 30px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.filter-btn:hover:not(.active) {
  background: #f1f5f9;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
  font-style: italic;
}

/* Task list */
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.9rem 1rem;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.task-item:hover {
  background: #f1f5f9;
  transform: translateX(2px);
}

.task-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6366f1;
}

.task-name {
  flex: 1;
  font-size: 0.95rem;
  color: #0f172a;
}

.done-text {
  text-decoration: line-through;
  color: #94a3b8;
}

/* Priority tags */
.priority-tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 30px;
  text-transform: uppercase;
}

.priority-low {
  background: #dcfce7;
  color: #15803d;
}

.priority-medium {
  background: #fed7aa;
  color: #b45309;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.remove-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #cbd5e1;
  padding: 0 4px;
  transition: all 0.2s;
}

.remove-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
}

/* Responsive tweaks */
@media (max-width: 550px) {
  .input-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-bar {
    justify-content: center;
  }
  
  .btn-clear {
    margin-left: 0;
  }
}
</style>