// src/composables/useAuth.ts
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// State global (bisa diakses dari mana saja)
const token = ref(localStorage.getItem('auth_token') || '')
const user = ref<any>(null)
const error = ref<string>('')

// Set header Authorization kalau token sudah ada (refresh page)
if (token.value) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
  const router = useRouter()

  // Fungsi login
  const login = async (email: string, password: string) => {
    error.value = ''
    try {
      const response = await axios.post('/api/login', { email, password })
      const { token: newToken, user: loggedUser } = response.data

      token.value = newToken
      user.value = loggedUser

      localStorage.setItem('auth_token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      router.push('/dashboard')  // atau halaman setelah login
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login gagal, cek email/password'
      throw err
    }
  }

  // Fungsi logout
  const logout = async () => {
    try {
      await axios.post('/api/logout')
    } catch (err) {
      console.warn('Logout API gagal, tapi token dihapus lokal')
    } finally {
      token.value = ''
      user.value = null
      error.value = ''
      localStorage.removeItem('auth_token')
      delete axios.defaults.headers.common['Authorization']
      router.push('/login')
    }
  }

  return {
    token,
    user,
    error,
    login,
    logout
  }
}