import { ref, onMounted, onUnmounted, computed } from 'vue'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDeviceType() {
    const deviceType = ref<DeviceType>('desktop')

    const updateDeviceType = () => {
        const width = window.innerWidth

        if (width <= 768) deviceType.value = 'mobile'
        else if (width <= 1024) deviceType.value = 'tablet'
        else deviceType.value = 'desktop'
    }

    onMounted(() => {
        updateDeviceType()
        window.addEventListener('resize', updateDeviceType)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateDeviceType)
    })

    return {
        deviceType,
        isMobile: computed(() => deviceType.value === 'mobile'),
    }
}
