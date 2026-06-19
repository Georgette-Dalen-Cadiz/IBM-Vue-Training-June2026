<!--
=============================================================
  DAY 5 ASSIGNMENT — TodoListView.vue
  Uses useFetch() to load and display todos from JSONPlaceholder
  EXTENSIONS:
    - Checkboxes are toggleable (local state)
    - Search input filters todos by title text
    - Retry button appears on error (using refetch)
=============================================================
-->
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'

const filter = ref('all') // 'all' | 'done' | 'pending'
const searchQuery = ref('') // EXTENSION: search by title

// TODO 1: Call useFetch with the JSONPlaceholder todos endpoint
// Rename 'data' to 'todos' using destructuring alias syntax
const { data: todos, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/todos')

// TODO 2: Create a filteredTodos computed() that:
//  - Returns [] if todos.value is null (still loading)
//  - Filters by filter.value ('all' shows first 20, 'done' shows completed, 'pending' shows incomplete)
//  - EXTENSION: additionally filters by searchQuery (case-insensitive title match)
const filteredTodos = computed(() => {
  if (!todos.value) return [] // still loading

  let result = todos.value

  // Apply filter (All / Done / Pending)
  if (filter.value === 'all') {
    result = result.slice(0, 20) // limit to first 20
  } else if (filter.value === 'done') {
    result = result.filter(todo => todo.completed)
  } else if (filter.value === 'pending') {
    result = result.filter(todo => !todo.completed)
  }

  // EXTENSION: search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(todo =>
      todo.title.toLowerCase().includes(query)
    )
  }

  return result
})

// EXTENSION: Toggle todo completion (local state)
function toggleTodo(id) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}
</script>

<template>
  <div class="todo-view">
    <h1>📋 Todo List</h1>
    <p class="subtitle">Loaded from JSONPlaceholder API</p>

    <!-- TODO 3: Show a loading message/spinner while loading is true -->
    <div v-if="loading" class="loading">⏳ Loading todos...</div>

    <!-- TODO 4: Show an error message if error has a value -->
    <div v-else-if="error" class="error-box">
      ❌ {{ error }}
      <!-- EXTENSION: Retry button -->
      <button @click="refetch" style="margin-left: 12px;">Retry</button>
    </div>

    <!-- TODO 5: Show the content block when NOT loading and NO error -->
    <div v-else>
      <!-- EXTENSION: Search input -->
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search todos by title..."
          class="search-input"
        />
      </div>

      <!-- Filter buttons -->
      <div class="filters">
        <!-- TODO 6: Three buttons — All, Done, Pending -->
        <!-- Each sets filter.value and gets :class="{ active: filter === '...' }" -->
        <button
          :class="{ active: filter === 'all' }"
          @click="filter = 'all'"
        >All</button>
        <button
          :class="{ active: filter === 'done' }"
          @click="filter = 'done'"
        >Done</button>
        <button
          :class="{ active: filter === 'pending' }"
          @click="filter = 'pending'"
        >Pending</button>
      </div>

      <!-- TODO 7: Render filteredTodos using v-for -->
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{ 'done-item': todo.completed }"
        >
          <!-- EXTENSION: removed 'disabled' and added @change -->
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo.id)"
          />
          <span :class="{ 'completed-text': todo.completed }">{{ todo.title }}</span>
        </li>
      </ul>

      <!-- TODO 8: Show count of visible items -->
      <div class="count">Showing {{ filteredTodos.length }} items</div>
    </div>
  </div>
</template>

<style scoped>
.todo-view { max-width: 560px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
h1 { color: #1B2A4A; margin-bottom: 4px; }
.subtitle { color: #9ca3af; font-size: 13px; margin-bottom: 20px; }
.loading { text-align: center; padding: 48px; color: #42B883; font-size: 16px; }
.error-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; color: #dc2626; }

/* EXTENSION: search bar styles */
.search-bar { margin-bottom: 16px; }
.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #42B883; }

.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.filters button { padding: 6px 16px; border: 1px solid #ddd; border-radius: 20px; background: white; cursor: pointer; font-size: 13px; }
.filters button.active { background: #42B883; color: white; border-color: #42B883; }
.todo-list { list-style: none; padding: 0; margin: 0; }
.todo-list li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border-radius: 6px; margin-bottom: 6px; border: 1px solid #eee; font-size: 14px; }
.todo-list li.done-item { opacity: 0.6; }
.todo-list li span { flex: 1; }
.completed-text { text-decoration: line-through; color: #9ca3af; }
.count { font-size: 13px; color: #9ca3af; margin-top: 12px; text-align: right; }
</style>