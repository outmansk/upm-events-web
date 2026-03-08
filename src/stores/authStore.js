import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        profile: null,
        loading: true
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        isClub: (state) => state.profile?.role === 'club',
        isStudent: (state) => state.profile?.role === 'student',
        isSuperAdmin: (state) => state.profile?.role === 'superadmin',
        isClubOrSuperAdmin: (state) => state.profile?.role === 'club' || state.profile?.role === 'superadmin',
        userFiliere: (state) => state.profile?.filiere,
        userDisplayName: (state) => state.profile?.displayName || state.user?.email || ''
    },
    actions: {
        setUser(user) {
            this.user = user
        },
        setProfile(profile) {
            this.profile = profile
        },
        setLoading(loading) {
            this.loading = loading
        },
        clear() {
            this.user = null
            this.profile = null
            this.loading = false
        }
    }
})
