import { create, type StateCreator } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from '../types'
import {
  getSession,
  onAuthStateChange,
  signIn,
  signOut,
} from '../services/auth'
import { getProfileByUserId } from '../services/profiles'

interface AuthState {
  session: Session | null
  profile: Profile | null
  initialized: boolean
  loading: boolean
  init: () => Promise<void>
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  setProfile: (profile: Profile | null) => void
}

const authStore: StateCreator<AuthState> = (set, get) => ({
  session: null,
  profile: null,
  initialized: false,
  loading: false,

  init: async () => {
    const session = await getSession()
    set({ session })

    if (session?.user) {
      const { data: profile } = await getProfileByUserId(session.user.id)
      set({ profile })
    }

    onAuthStateChange((nextSession) => {
      set({ session: nextSession })
      if (nextSession?.user) {
        getProfileByUserId(nextSession.user.id).then(({ data }) => {
          set({ profile: data })
        })
      } else {
        set({ profile: null })
      }
    })

    set({ initialized: true })
  },

  login: async (email, password) => {
    set({ loading: true })
    const result = await signIn(email, password)
    if (result.error) {
      set({ loading: false })
      let message = result.error.message
      if (message.includes('Invalid login credentials')) {
        message = 'Email atau kata sandi salah.'
      } else if (message.includes('Email not confirmed')) {
        message = 'Email belum diverifikasi. Periksa inbox Anda.'
      }
      return { error: message }
    }
    set({ session: result.session, loading: false })
    if (result.session?.user) {
      const { data: profile } = await getProfileByUserId(result.session.user.id)
      set({ profile })
    }
    return { error: null }
  },

  logout: async () => {
    await signOut()
    set({ session: null, profile: null })
  },

  refreshProfile: async () => {
    const { session } = get()
    if (!session?.user) return
    const { data } = await getProfileByUserId(session.user.id)
    set({ profile: data })
  },

  setProfile: (profile) => set({ profile }),
})

export const useAuthStore = create(authStore)