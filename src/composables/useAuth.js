import { ref, computed, onMounted } from 'vue'
import { initializeApp, deleteApp } from 'firebase/app'
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import { useAuthStore } from '@/stores/authStore'
import { useNotifications } from './useNotifications'

export function useAuth() {
    const authStore = useAuthStore()
    const { showError, showSuccess } = useNotifications()
    const loading = ref(false)

    const currentUser = computed(() => authStore.user)
    const userProfile = computed(() => authStore.profile)
    const isClub = computed(() => authStore.isClub)
    const isStudent = computed(() => authStore.isStudent)

    async function fetchProfile(uid) {
        try {
            const docRef = doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                authStore.setProfile({ uid, ...docSnap.data() })
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
        }
    }

    function initAuth() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    authStore.setUser({
                        uid: user.uid,
                        email: user.email
                    })
                    await fetchProfile(user.uid)
                } else {
                    authStore.clear()
                }
                authStore.setLoading(false)
                resolve()
            })
        })
    }

    async function login(email, password) {
        loading.value = true
        try {
            await signInWithEmailAndPassword(auth, email, password)
            showSuccess('Connexion réussie !')
            return true
        } catch (err) {
            showError(getAuthErrorMessage(err.code))
            return false
        } finally {
            loading.value = false
        }
    }

    async function register(email, password, profileData) {
        loading.value = true
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            const userData = {
                uid: cred.user.uid,
                email,
                displayName: profileData.displayName,
                role: profileData.role,
                filiere: profileData.filiere,
                createdAt: serverTimestamp()
            }
            if (profileData.role === 'club') {
                userData.clubName = profileData.clubName
            }
            await setDoc(doc(db, 'users', cred.user.uid), userData)
            authStore.setProfile(userData)
            showSuccess('Compte créé avec succès !')
            return true
        } catch (err) {
            showError(getAuthErrorMessage(err.code))
            return false
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await signOut(auth)
            authStore.clear()
            showSuccess('Déconnexion réussie')
        } catch (err) {
            showError('Erreur lors de la déconnexion')
        }
    }

    // Super Admin: create a club account without signing out current user
    async function createClubAccount(email, password, clubName) {
        try {
            // Use a secondary app instance to avoid signing out the super admin
            const secondaryApp = initializeApp(auth.app.options, 'secondary-' + Date.now())
            const secondaryAuth = getAuth(secondaryApp)

            const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)

            const userData = {
                uid: cred.user.uid,
                email,
                displayName: clubName,
                clubName,
                role: 'club',
                filiere: '',
                createdAt: serverTimestamp()
            }
            await setDoc(doc(db, 'users', cred.user.uid), userData)

            // Clean up secondary app
            await signOut(secondaryAuth)
            await deleteApp(secondaryApp)

            showSuccess(`Compte club "${clubName}" créé avec succès !`)
            return true
        } catch (err) {
            showError(getAuthErrorMessage(err.code))
            return false
        }
    }

    // Super Admin: list all club accounts
    async function fetchClubAccounts() {
        try {
            const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'club')))
            return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        } catch (err) {
            console.error('Error fetching club accounts:', err)
            showError('Erreur lors du chargement des clubs')
            return []
        }
    }

    // Super Admin: delete a club account from Firestore
    async function deleteClubAccount(uid) {
        try {
            await deleteDoc(doc(db, 'users', uid));
            showSuccess('Compte club supprimé');
            return true;
        } catch (err) {
            console.error('Error deleting club:', err);
            showError('Erreur lors de la suppression du compte');
            return false;
        }
    }

    function getAuthErrorMessage(code) {
        const messages = {
            'auth/user-not-found': 'Aucun compte trouvé avec cet email',
            'auth/wrong-password': 'Mot de passe incorrect',
            'auth/email-already-in-use': 'Cet email est déjà utilisé',
            'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
            'auth/invalid-email': 'Adresse email invalide',
            'auth/invalid-credential': 'Email ou mot de passe incorrect'
        }
        return messages[code] || 'Une erreur est survenue'
    }

    return {
        currentUser,
        userProfile,
        isClub,
        isStudent,
        loading,
        login,
        register,
        logout,
        initAuth,
        fetchProfile,
        createClubAccount,
        fetchClubAccounts,
        deleteClubAccount
    }
}
