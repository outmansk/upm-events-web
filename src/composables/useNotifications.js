import { ref } from 'vue'

const notifications = ref([])

let idCounter = 0

export function useNotifications() {
    function addNotification(type, message) {
        const id = ++idCounter
        notifications.value.push({ id, type, message })
        setTimeout(() => {
            removeNotification(id)
        }, 3000)
    }

    function removeNotification(id) {
        notifications.value = notifications.value.filter((n) => n.id !== id)
    }

    function showSuccess(message) {
        addNotification('success', message)
    }

    function showError(message) {
        addNotification('error', message)
    }

    function showInfo(message) {
        addNotification('info', message)
    }

    return {
        notifications,
        showSuccess,
        showError,
        showInfo,
        removeNotification
    }
}
