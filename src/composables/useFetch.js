// =============================================================
//  DAY 5 ASSIGNMENT — composables/useFetch.js
//  Topic: API Integration, Async/Await, Error Handling, Composables
//  Files: composables/useFetch.js  |  TodoListView.vue
//  Time: 60 minutes
// =============================================================
//
// OBJECTIVE
// ---------
// Build a reusable useFetch() composable that encapsulates the
// loading/error/data pattern for any API call. Then use it to
// display live data from a free public REST API.
//
// API: https://jsonplaceholder.typicode.com/todos
// (Returns 200 todo items — no auth required)
//
// WHAT TO BUILD
// -------------
// composables/useFetch.js:
//   - Accepts a URL string as an argument
//   - Returns: { data, loading, error, refetch }
//   - data    = ref(null)  — the parsed JSON response
//   - loading = ref(true)  — true while fetching, false after
//   - error   = ref(null)  — error message string if request failed
//   - refetch = function   — allows manually re‑fetching (useful for retry)
//   - Fetches automatically when the component using it mounts
//
// EXTENSIONS implemented:
//   - `refetch` enables a "Retry" button in the UI
//   - The component will also add a search input and a second view (see TodoListView.vue)
//
// REQUIREMENTS (Acceptance Criteria)
// ------------------------------------
//  [x] useFetch is a standalone function in its own file (not in a component)
//  [x] Uses onMounted() to trigger the fetch
//  [x] Uses try/catch/finally — loading becomes false in finally
//  [x] Response status is checked: if (!response.ok) throw new Error(...)
//  [x] Loading state shows a visible spinner or message in the template
//  [x] Error state shows a visible error message
//  [x] Filter buttons work — computed() derives the visible list
//  [x] Extension: Retry button (via refetch)
//  [x] Extension: Search input (added in component)
//  [x] Extension: (Optional) second view – see separate component
// =============================================================

import { ref, onMounted } from 'vue'

// TODO 1: Export a useFetch function that accepts a url parameter
export function useFetch(url) {

  // TODO 2: Create three refs — data, loading, error
  const data    = ref(null)
  const loading = ref(true)
  const error   = ref(null)

  // Create a fetch function to retry fetching the data (used in onMounted and for refetch)
  const fetchData = async () => {
    // Reset error before retry
    error.value = null
    loading.value = true

    try {
      // TODO 4: fetch the url, check response.ok, parse JSON into data.value
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      // TODO 5: assign the error message to error.value
      error.value = e.message || 'Failed to fetch data'
    } finally {
      // TODO 6: set loading.value = false
      loading.value = false
    }
  }

  // TODO 3: Use onMounted with an async callback to fetch the data
  onMounted(() => {
    fetchData()
  })

  // TODO 7: Return the three refs plus the fetchData function for retry
  return { data, loading, error, refetch: fetchData }
}