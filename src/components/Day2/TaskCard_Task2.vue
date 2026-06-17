<!--
=============================================================
  DAY 2 ASSIGNMENT — Reusable TaskCard Component
  Topic: Props, Emits, Slots, Component Lifecycle
  Files: TaskCard.vue (child)  +  TaskListView.vue (parent)
  Time: 60 minutes
=============================================================

OBJECTIVE
---------
Build a reusable TaskCard child component that accepts data as props
and communicates back to the parent via custom events (emits). The
parent renders a list of TaskCards and handles all state changes.

WHAT TO BUILD — TaskCard.vue (this file)
-----------------------------------------
  1. Accept a "task" prop: { id, name, done, dueDate }
  2. Display the task name and dueDate (via a named slot "meta")
  3. Emit "complete" event (payload: task.id) when Complete/Undo clicked
  4. Emit "delete" event (payload: task.id) when Delete clicked
  5. Show "Complete" when task.done is false, "Undo" when true
  6. Apply a visual style change when task.done is true

WHAT TO BUILD — TaskListView.vue (see that file)
-------------------------------------------------
  1. Hold a tasks ref array with at least 3 sample tasks
  2. Render a TaskCard for each task using v-for
  3. Handle @complete → toggle that task's done property
  4. Handle @delete → remove that task from the array
  5. Fill the "meta" named slot with the due date

REQUIREMENTS (Acceptance Criteria)
------------------------------------
  [x] TaskCard uses defineProps({ task: Object })
  [x] TaskCard uses defineEmits(['complete', 'delete'])
  [x] TaskCard has <slot name="meta" /> for optional metadata
  [x] Parent passes :task="task" and listens @complete @delete
  [x] Parent fills the slot with <template #meta>...</template>
  [x] Data flows DOWN (props) and events flow UP (emits)
  [x] Parent owns the state — TaskCard never mutates props directly

EXTENSION (if you finish early)
---------------------------------
  - Add a priority badge prop (low/medium/high) with colour coding
  - Add an edit mode: clicking the task name turns it into an input
  - Emit an "update" event when the edited name is saved

HINTS (read only if stuck)
---------------------------
  Hint 1: const props = defineProps({ task: { type: Object, required: true } })
  Hint 2: const emit = defineEmits(['complete', 'delete'])
  Hint 3: @click="emit('complete', props.task.id)"
  Hint 4: In the parent — @complete="handleComplete"
           function handleComplete(id) { find task by id, toggle done }
  Hint 5: Named slot in child  → <slot name="meta" />
           Fill in parent      → <template #meta>Due: {{ task.dueDate }}</template>
  Hint 6: NEVER do this inside TaskCard: props.task.done = !props.task.done
           That mutates a prop directly — Vue will warn you. Emit instead.
=============================================================
-->

<script setup>
import { ref, nextTick } from 'vue'

// TODO 1 & 2: Define the task prop with type Object, required: true
// EXTENSION: Added a priority badge prop
const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  priority: {
    type: String,
    default: 'low',
    validator: (value) => ['low', 'medium', 'high'].includes(value)
  }
})

// TODO 3: Define emits for 'complete' and 'delete'
// EXTENSION: Added 'update' to emits
const emit = defineEmits(['complete', 'delete', 'update'])

// EXTENSION: Edit mode state and logic
const isEditing = ref(false)
const editedName = ref('')
const nameInputRef = ref(null)

const startEdit = async () => {
  isEditing.value = true
  editedName.value = props.task.name
  // Wait for the DOM to update so the input exists before focusing
  await nextTick()
  if (nameInputRef.value) {
    nameInputRef.value.focus()
  }
}

const saveEdit = () => {
  if (!isEditing.value) return // Prevent double-trigger from blur + enter
  isEditing.value = false
  
  if (editedName.value.trim() !== '' && editedName.value !== props.task.name) {
    emit('update', { id: props.task.id, newName: editedName.value.trim() })
  }
}

const cancelEdit = () => {
  isEditing.value = false
}
</script>

<template>
  <div class="task-card" :class="{ completed: task.done }">

    <div class="task-header">
      <div class="title-container">
        <span 
          v-if="!isEditing" 
          class="name" 
          @click="startEdit"
          title="Click to edit"
        >
          {{ task.name }}
        </span>
        <input 
          v-else
          ref="nameInputRef"
          v-model="editedName"
          class="name-input"
          @keyup.enter="saveEdit"
          @blur="saveEdit"
          @keyup.esc="cancelEdit"
        />

        <span class="badge" :class="priority">
          {{ priority }}
        </span>
      </div>

      <div class="meta">
        <slot name="meta" />
      </div>
    </div>

    <div class="task-actions">
      <button class="btn-complete" @click="emit('complete', task.id)">
        {{ task.done ? 'Undo' : 'Complete' }}
      </button>

      <button class="btn-delete" @click="emit('delete', task.id)">
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  transition: all 0.2s;
}
.task-card.completed {
  background: #f0fdf4;
  border-color: #86efac;
  opacity: 0.8;
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.title-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.task-header span.name {
  font-weight: 600;
  font-size: 15px;
  color: #1B2A4A;
  cursor: pointer;
  border-bottom: 1px dashed transparent;
  transition: border-bottom-color 0.2s;
}
.task-header span.name:hover {
  border-bottom-color: #1B2A4A;
}
.name-input {
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #1B2A4A;
  padding: 2px 6px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  outline: none;
}
.name-input:focus {
  border-color: #42B883;
}
.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: capitalize;
  font-weight: bold;
}
.badge.low {
  background: #f1f5f9;
  color: #64748b;
}
.badge.medium {
  background: #fef08a;
  color: #ca8a04;
}
.badge.high {
  background: #fecaca;
  color: #dc2626;
}
.task-header .meta {
  font-size: 12px;
  color: #9ca3af;
}
.task-actions {
  display: flex;
  gap: 8px;
}
.btn-complete {
  padding: 5px 14px;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.btn-delete {
  padding: 5px 14px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
</style>