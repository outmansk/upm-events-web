import { ref } from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/stores/authStore'

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de UPM Events, la plateforme officielle des événements de l'Université Privée de Marrakech (UPM).

Ton rôle :
- Aider les étudiants à trouver et comprendre les événements du campus
- Répondre aux questions sur la vie étudiante à l'UPM
- Guider les utilisateurs sur l'utilisation de la plateforme UPM Events
- Être amical, concis et professionnel

Informations sur l'UPM :
- Adresse : Km 13, Route d'Amizmiz, Marrakech, Maroc
- Téléphone : +212 5 24 49 80 00
- Email : contact@upm.ac.ma
- Site web : upm.ac.ma
- Filières : Ingénierie, Business, Santé, Arts, Sciences

Informations sur la plateforme :
- Les étudiants peuvent voir les événements confirmés, voter et s'inscrire
- Le vote utilise un système d'étoiles (1 à 5)
- Les clubs proposent les événements qui doivent être approuvés par l'administration

Règles :
- Réponds toujours en français sauf si le message est dans une autre langue
- Sois concis (max 3-4 phrases)
- Utilise des emojis
- Ne fournis jamais de fausses informations`

export function useChatbot() {
    const messages = ref([])
    const isLoading = ref(false)
    const isOpen = ref(false)

    let eventsCache = null

    function initChat() {
        const authStore = useAuthStore()
        const userName = authStore.userDisplayName?.split(' ')[0] || 'étudiant'
        messages.value = [{
            role: 'bot',
            content: `Salut ${userName} ! 👋 Je suis l'assistant UPM Events. Pose-moi tes questions sur les événements du campus, les clubs, ou la vie étudiante ! 🎓`,
            timestamp: new Date()
        }]
    }

    async function fetchEventsContext() {
        if (eventsCache && eventsCache.timestamp > Date.now() - 120000) {
            return eventsCache.data
        }
        try {
            const q = query(collection(db, 'events'), where('status', '==', 'confirmed'))
            const snapshot = await getDocs(q)
            const events = snapshot.docs.map(doc => {
                const d = doc.data()
                return { titre: d.title, date: d.date, lieu: d.location, categorie: d.category, club: d.clubName }
            })
            const result = events.length > 0
                ? `\nÉvénements confirmés: ${JSON.stringify(events)}`
                : ''
            eventsCache = { data: result, timestamp: Date.now() }
            return result
        } catch (err) {
            console.error('Events fetch error:', err)
            return ''
        }
    }

    async function sendMessage(userMessage) {
        if (!userMessage.trim() || isLoading.value) return

        messages.value.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        })

        isLoading.value = true

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY
            if (!apiKey) {
                throw new Error('VITE_GEMINI_API_KEY is not defined in .env')
            }

            // Fetch events context
            const eventsContext = await fetchEventsContext()

            // Build conversation history as text
            const conversationHistory = messages.value
                .map(m => m.role === 'user' ? `Étudiant: ${m.content}` : `Assistant: ${m.content}`)
                .join('\n')

            // Build the full prompt
            const fullPrompt = `${SYSTEM_PROMPT}${eventsContext}\n\nConversation:\n${conversationHistory}\n\nAssistant:`

            // Use v1 instead of v1beta to avoid 404
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.7
                    }
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                const errMsg = errorData?.error?.message || response.statusText
                throw new Error(`${response.status} - ${errMsg}`)
            }

            const data = await response.json()
            const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text

            if (!responseText) {
                throw new Error('Réponse vide de l\'API')
            }

            messages.value.push({
                role: 'bot',
                content: responseText,
                timestamp: new Date()
            })
        } catch (error) {
            console.error('Chatbot error details:', error.message, error)

            let errorMsg = `Désolé, une erreur s'est produite: ${error.message} 🔧`

            if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401')) {
                errorMsg = 'La clé API Gemini est invalide. Veuillez vérifier la configuration. 🔑'
            } else if (error.message?.includes('quota') || error.message?.includes('429')) {
                errorMsg = 'Le quota de requêtes est atteint. Réessaie plus tard ! ⏳'
            } else if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
                errorMsg = 'Problème de connexion internet. Vérifie ta connexion ! 🌐'
            }

            messages.value.push({
                role: 'bot',
                content: errorMsg,
                timestamp: new Date()
            })
        } finally {
            isLoading.value = false
        }
    }

    function toggleChat() {
        isOpen.value = !isOpen.value
        if (isOpen.value && messages.value.length === 0) {
            initChat()
        }
    }

    function clearChat() {
        eventsCache = null
        messages.value = []
        initChat()
    }

    return {
        messages,
        isLoading,
        isOpen,
        sendMessage,
        toggleChat,
        clearChat,
        initChat
    }
}
