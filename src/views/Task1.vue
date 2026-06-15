<!--
=============================================================
  DAY 1 ASSIGNMENT — Reactive Task Counter App
  Topic: Vue 3 Composition API (ref, computed, v-model, v-for)
=============================================================
-->

<script setup>
import { ref, computed } from 'vue'

// ── Reactive state ────────────────────────────────────────
const newTaskName     = ref('')
const newTaskPriority = ref('medium')
const tasks           = ref([])
const activeFilter    = ref('all')

const priorityOptions = [
  { label: 'Low',    value: 'low'    },
  { label: 'Medium', value: 'medium' },
  { label: 'High',   value: 'high'   },
]
const filterOptions = ['all', 'pending', 'done']

// ── Computed counts ───────────────────────────────────────
const totalCount   = computed(() => tasks.value.length)
const doneCount    = computed(() => tasks.value.filter(t => t.done).length)
const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

// ── Sorted + filtered list ────────────────────────────────
// Pending tasks always appear before completed ones
const sortedTasks = computed(() =>
  [...tasks.value].sort((a, b) => Number(a.done) - Number(b.done))
)

const filteredTasks = computed(() => {
  if (activeFilter.value === 'done')    return tasks.value.filter(t =>  t.done)
  if (activeFilter.value === 'pending') return tasks.value.filter(t => !t.done)
  return sortedTasks.value
})

// ── Actions ───────────────────────────────────────────────
function addTask() {
  if (!newTaskName.value.trim()) return
  tasks.value.push({
    id:       Date.now(),
    name:     newTaskName.value.trim(),
    done:     false,
    priority: newTaskPriority.value,
  })
  newTaskName.value     = ''
  newTaskPriority.value = 'medium'
}

function toggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
}

function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function clearDone() {
  tasks.value = tasks.value.filter(t => !t.done)
}

// ── Helpers ───────────────────────────────────────────────
const priorityClass = { low: 'pri-low', medium: 'pri-medium', high: 'pri-high' }

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="app">
    <h1>
      <span class="title-icon">✓</span>
      Task Counter
    </h1>

    <!-- ── Add task ─────────────────────────────────────── -->
    <div class="input-card">
      <div class="input-row">
        <input
          v-model="newTaskName"
          @keyup.enter="addTask"
          type="text"
          placeholder="What needs to be done?"
          class="task-input"
        />
        <select v-model="newTaskPriority" class="pri-select">
          <option
            v-for="opt in priorityOptions"
            :key="opt.value"
            :value="opt.value"
          >{{ opt.label }}</option>
        </select>
        <button @click="addTask" class="btn btn-primary">
          + Add
        </button>
      </div>
    </div>

    <!-- ── Stats ────────────────────────────────────────── -->
    <div class="stats">
      <div class="stat">
        <div class="stat-label">Total</div>
        <div class="stat-num">{{ totalCount }}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Done</div>
        <div class="stat-num stat-done">{{ doneCount }}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Pending</div>
        <div class="stat-num stat-pending">{{ pendingCount }}</div>
      </div>
    </div>

    <!-- ── Filters ──────────────────────────────────────── -->
    <div class="filter-row">
      <button
        v-for="f in filterOptions"
        :key="f"
        :class="['filter-pill', { active: activeFilter === f }]"
        @click="activeFilter = f"
      >
        {{ capitalize(f) }}
      </button>

      <button
        v-if="doneCount > 0"
        @click="clearDone"
        class="btn btn-danger clear-btn"
      >
        Clear Done
      </button>
    </div>

    <!-- ── Empty state ──────────────────────────────────── -->
    <p v-if="filteredTasks.length === 0" class="empty">
      {{ tasks.length === 0
          ? 'No tasks yet. Add one above!'
          : 'No tasks match this filter.' }}
    </p>

    <!-- ── Task list ────────────────────────────────────── -->
    <ul class="task-list">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        :class="['task-item', { 'is-done': task.done }]"
      >
        <!-- Custom checkbox -->
        <button
          :class="['cb', { checked: task.done }]"
          @click="toggleTask(task.id)"
          :aria-label="task.done ? 'Mark as pending' : 'Mark as done'"
          role="checkbox"
          :aria-checked="task.done"
        >
          <span v-if="task.done" class="cb-check">✓</span>
        </button>

        <!-- Task name -->
        <label
          :class="['task-name', { 'done-text': task.done }]"
          @click="toggleTask(task.id)"
        >
          {{ task.name }}
        </label>

        <!-- Priority tag -->
        <span :class="['pri-tag', priorityClass[task.priority]]">
          {{ capitalize(task.priority) }}
        </span>

        <!-- Remove button -->
        <button
          class="icon-btn"
          @click="removeTask(task.id)"
          aria-label="Remove task"
        >
          ✕
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* ── Reset ───────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── App shell ───────────────────────────────────────────── */
.app {
  max-width: 640px;
  margin: 40px auto;
  padding: 0 16px 40px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
}

/* ── Heading ─────────────────────────────────────────────── */
h1 {
  font-size: 22px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #534AB7;
  color: #fff;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── Input card ──────────────────────────────────────────── */
.input-card {
  background: #ffffff;
  border: 0.5px solid #ddd;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.task-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border: 0.5px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  background: #f6f6f6;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.task-input::placeholder { color: #999; }

.task-input:focus {
  border-color: #534AB7;
  box-shadow: 0 0 0 3px rgba(83, 74, 183, 0.1);
  background: #fff;
}

.pri-select {
  height: 36px;
  padding: 0 8px;
  border: 0.5px solid #ccc;
  border-radius: 8px;
  font-size: 13px;
  background: #f6f6f6;
  color: #1a1a1a;
  outline: none;
  cursor: pointer;
  min-width: 90px;
}

/* ── Buttons ─────────────────────────────────────────────── */
.btn {
  height: 36px;
  padding: 0 14px;
  border: 0.5px solid #ccc;
  border-radius: 8px;
  background: #fff;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: background 0.12s, transform 0.1s;
  white-space: nowrap;
}

.btn:hover   { background: #f0f0f0; }
.btn:active  { transform: scale(0.98); }

.btn-primary {
  background: #534AB7;
  color: #EEEDFE;
  border-color: #534AB7;
}
.btn-primary:hover { background: #3C3489; border-color: #3C3489; }

.btn-danger {
  background: transparent;
  color: #A32D2D;
  border-color: #ddd;
}
.btn-danger:hover { background: #FCEBEB; }

/* ── Stats ───────────────────────────────────────────────── */
.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 1rem;
}

/* Base */
.stat {
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb; 
}

/* Total (neutral) */
.stat:nth-child(1) {
  background: #f9fafb;
}

.stat-label {
  font-size: 11px;
  color: #6B7280; 
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-num {
  font-size: 24px;
  font-weight: 600;
  color: #374151; 
}

.stat:first-child .stat-num {
  color: #4B5563;
}

.stat-done,
.stat-pending {
  color: #374151; /* same as default */
}

/* ── Filters ─────────────────────────────────────────────── */
.filter-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-pill {
  height: 30px;
  padding: 0 14px;
  border: 0.5px solid #ddd;
  border-radius: 15px;
  background: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.12s;
}

.filter-pill:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}

.filter-pill.active {
  background: #EEEDFE;
  color: #3C3489;
  border-color: #AFA9EC;
  font-weight: 500;
}

.clear-btn { margin-left: auto; }

/* ── Empty state ─────────────────────────────────────────── */
.empty {
  text-align: center;
  color: #999;
  font-size: 14px;
  font-style: italic;
  padding: 2.5rem 0;
}

/* ── Task list ───────────────────────────────────────────── */
.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  background: #ffffff;
  border: 0.5px solid #e5e5e5;
  border-radius: 8px;
  transition: border-color 0.15s;
}

.task-item:hover { border-color: #bbb; }
.task-item.is-done { opacity: 0.65; }

/* ── Custom checkbox ─────────────────────────────────────── */
.cb {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1.5px solid #aaa;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s, border-color 0.12s;
  padding: 0;
}

.cb.checked {
  background: #534AB7;
  border-color: #534AB7;
}

.cb-check {
  color: #fff;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
}

/* ── Task name ───────────────────────────────────────────── */
.task-name {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  line-height: 1.4;
  user-select: none;
}

.done-text {
  text-decoration: line-through;
  color: #aaa;
}

/* ── Priority tag ────────────────────────────────────────── */
.pri-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.pri-low    { background: #EAF3DE; color: #3B6D11; }
.pri-medium { background: #FAEEDA; color: #854F0B; }
.pri-high   { background: #FCEBEB; color: #A32D2D; }

/* ── Remove button ───────────────────────────────────────── */
.icon-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #bbb;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
  transition: background 0.12s, color 0.12s;
}

.icon-btn:hover {
  background: #FCEBEB;
  color: #A32D2D;
}
</style>