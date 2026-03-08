import { ref } from 'vue'
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    increment,
    onSnapshot,
    orderBy,
    serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/stores/authStore'
import { useNotifications } from './useNotifications'

export function useEvents() {
    const events = ref([])
    const event = ref(null)
    const loading = ref(false)
    const authStore = useAuthStore()
    const { showSuccess, showError, showInfo } = useNotifications()

    async function fetchConfirmedEvents(filters = {}) {
        loading.value = true
        try {
            const constraints = [where('status', '==', 'confirmed')]

            if (filters.type && filters.type !== 'all') {
                constraints.push(where('type', '==', filters.type))
            }
            if (filters.clubId) {
                constraints.push(where('clubId', '==', filters.clubId))
            }

            constraints.push(orderBy('date', 'desc'))

            const q = query(collection(db, 'events'), ...constraints)
            const snap = await getDocs(q)
            let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

            // Filter by audience
            const userFiliere = authStore.userFiliere
            const isStudent = authStore.isStudent
            results = results.filter((e) => {
                if (e.targetAudience === 'all') return true
                if (!isStudent) return true // Admins and clubs see everything
                if (Array.isArray(e.targetAudience)) {
                    return e.targetAudience.includes(userFiliere)
                }
                return true
            })

            // Search filter
            if (filters.search) {
                const term = filters.search.toLowerCase()
                results = results.filter((e) =>
                    e.title.toLowerCase().includes(term)
                )
            }

            events.value = results
        } catch (err) {
            console.error('Error fetching confirmed events:', err)
            showError('Erreur lors du chargement des événements')
        } finally {
            loading.value = false
        }
    }

    function fetchPollEvents() {
        loading.value = true
        const q = query(
            collection(db, 'events'),
            where('status', '==', 'poll'),
            orderBy('createdAt', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snap) => {
            events.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            loading.value = false
        }, (err) => {
            console.error('Error listening to polls:', err)
            showError('Erreur lors du chargement des sondages')
            loading.value = false
        })

        return unsubscribe
    }

    async function getEventById(id) {
        loading.value = true
        try {
            const docRef = doc(db, 'events', id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                event.value = { id: docSnap.id, ...docSnap.data() }
            } else {
                event.value = null
                showError('Événement non trouvé')
            }
        } catch (err) {
            console.error('Error fetching event:', err)
            showError('Erreur lors du chargement de l\'événement')
        } finally {
            loading.value = false
        }
    }

    async function addEvent(eventData) {
        loading.value = true
        try {
            const data = {
                ...eventData,
                clubId: authStore.user.uid,
                clubName: authStore.profile.clubName || authStore.profile.displayName,
                votesCount: 0,
                voterIds: [],
                attendees: [],
                createdAt: serverTimestamp()
            }
            const docRef = await addDoc(collection(db, 'events'), data)
            showSuccess('Événement créé avec succès !')
            return docRef.id
        } catch (err) {
            console.error('Error adding event:', err)
            showError('Erreur lors de la création de l\'événement')
            return null
        } finally {
            loading.value = false
        }
    }

    async function toggleVote(eventId) {
        const uid = authStore.user?.uid
        if (!uid) {
            showError('Veuillez vous connecter pour voter')
            return
        }

        try {
            const eventRef = doc(db, 'events', eventId)
            const eventSnap = await getDoc(eventRef)
            if (!eventSnap.exists()) return

            const data = eventSnap.data()
            const voterIds = data.voterIds || []
            const hasVoted = voterIds.includes(uid)

            if (hasVoted) {
                await updateDoc(eventRef, {
                    voterIds: arrayRemove(uid),
                    votesCount: increment(-1)
                })
                showInfo('Vote retiré')
            } else {
                await updateDoc(eventRef, {
                    voterIds: arrayUnion(uid),
                    votesCount: increment(1)
                })
                showSuccess('Vote enregistré !')
            }
        } catch (err) {
            console.error('Error toggling vote:', err)
            showError('Erreur lors du vote')
        }
    }

    async function rateEvent(eventId, stars) {
        const uid = authStore.user?.uid
        if (!uid) {
            showError('Veuillez vous connecter pour noter')
            return
        }

        try {
            const eventRef = doc(db, 'events', eventId)
            const eventSnap = await getDoc(eventRef)
            if (!eventSnap.exists()) return

            const data = eventSnap.data()
            const ratings = data.ratings || {}

            // Update the user's rating
            ratings[uid] = stars

            // Calculate new average
            const allRatings = Object.values(ratings)
            const count = allRatings.length
            const sum = allRatings.reduce((a, b) => a + b, 0)
            const average = count > 0 ? Number((sum / count).toFixed(1)) : 0

            await updateDoc(eventRef, {
                ratings,
                averageRating: average,
                ratingsCount: count
            })

            showSuccess('Note enregistrée !')
        } catch (err) {
            console.error('Error rating event:', err)
            showError('Erreur lors de la notation')
        }
    }

    async function registerToEvent(eventId) {
        const uid = authStore.user?.uid
        if (!uid) return

        try {
            const eventRef = doc(db, 'events', eventId)
            await updateDoc(eventRef, {
                attendees: arrayUnion(uid)
            })
            showSuccess('Inscription réussie !')
        } catch (err) {
            console.error('Error registering to event:', err)
            showError('Erreur lors de l\'inscription')
        }
    }

    async function fetchClubEvents(clubId) {
        loading.value = true
        try {
            const q = query(
                collection(db, 'events'),
                where('clubId', '==', clubId),
                orderBy('createdAt', 'desc')
            )
            const snap = await getDocs(q)
            events.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        } catch (err) {
            console.error('Error fetching club events:', err)
            showError('Erreur lors du chargement de vos événements')
        } finally {
            loading.value = false
        }
    }

    async function fetchPendingEvents() {
        loading.value = true
        try {
            const q = query(
                collection(db, 'events'),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            )
            const snap = await getDocs(q)
            events.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        } catch (err) {
            console.error('Error fetching pending events:', err)
            showError('Erreur lors du chargement des événements en attente')
        } finally {
            loading.value = false
        }
    }

    async function approveEvent(eventId, newStatus = 'confirmed') {
        try {
            const eventRef = doc(db, 'events', eventId)
            await updateDoc(eventRef, { status: newStatus })
            showSuccess('Événement approuvé !')
            // Remove from local list
            events.value = events.value.filter((e) => e.id !== eventId)
        } catch (err) {
            console.error('Error approving event:', err)
            showError("Erreur lors de l'approbation")
        }
    }

    async function rejectEvent(eventId) {
        try {
            const eventRef = doc(db, 'events', eventId)
            await deleteDoc(eventRef)
            showSuccess('Événement rejeté et supprimé')
            events.value = events.value.filter((e) => e.id !== eventId)
        } catch (err) {
            console.error('Error rejecting event:', err)
            showError('Erreur lors du rejet')
        }
    }

    return {
        events,
        event,
        loading,
        fetchConfirmedEvents,
        fetchPollEvents,
        getEventById,
        addEvent,
        toggleVote,
        rateEvent,
        registerToEvent,
        fetchClubEvents,
        fetchPendingEvents,
        approveEvent,
        rejectEvent
    }
}
