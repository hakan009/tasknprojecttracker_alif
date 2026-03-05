<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

const stats = ref({
  active_projects: 0,
  pending_tasks: 0,
  upcoming_tasks: [] as any[]
})

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await axios.get('/api/dashboard')
    stats.value = res.data
  } catch (err: any) {
    error.value = 'Gagal memuat dashboard'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <button 
      @click="logout" 
      class="mb-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>

    <div v-if="loading" class="text-center">Memuat...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold">Project Aktif</h2>
        <p class="text-4xl font-bold mt-2">{{ stats.active_projects }}</p>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold">Task Belum Selesai</h2>
        <p class="text-4xl font-bold mt-2">{{ stats.pending_tasks }}</p>
      </div>

      <!-- Card 3: Upcoming Tasks -->
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold">Task Mendekati Deadline</h2>
        <ul class="mt-2 space-y-2">
          <li v-for="task in stats.upcoming_tasks" :key="task.id" class="text-sm">
            {{ task.title }} 
            <span class="text-gray-500">({{ task.due_date }})</span>
          </li>
          <li v-if="!stats.upcoming_tasks.length" class="text-gray-500 italic">
            Tidak ada task mendekati deadline
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>