import { useDeviceType } from "@/composables/useDeviceType";

export const isMobile = () => {
    const { deviceType, isMobile } = useDeviceType();
    return isMobile.value;
}