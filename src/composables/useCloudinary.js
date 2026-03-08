import { ref } from 'vue'

export function useCloudinary() {
    const uploadProgress = ref(0)
    const uploading = ref(false)

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    async function uploadImage(file) {
        if (!cloudName || !uploadPreset) {
            console.error('Cloudinary config missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env')
            throw new Error('Configuration Cloudinary manquante')
        }

        uploading.value = true
        uploadProgress.value = 0

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    uploadProgress.value = Math.round((e.loaded / e.total) * 100)
                }
            })

            xhr.addEventListener('load', () => {
                uploading.value = false
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText)
                    resolve(response.secure_url)
                } else {
                    reject(new Error('Échec de l\'upload'))
                }
            })

            xhr.addEventListener('error', () => {
                uploading.value = false
                reject(new Error('Erreur réseau lors de l\'upload'))
            })

            xhr.open('POST', url)
            xhr.send(formData)
        })
    }

    return {
        uploadImage,
        uploadProgress,
        uploading
    }
}
