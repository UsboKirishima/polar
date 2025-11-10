export const colorMap = {
    Deep_blue: [45, 75, 130, 0.6], // Deep blue (1.0 = opaco)
    Dark_magenta: [130, 45, 75, 0.6], // Dark magenta
    Dark_olive: [75, 130, 45, 0.6], // Dark olive green
    Brownish: [130, 100, 45, 0.6], // Brownish
    Deep_purple: [75, 45, 130, 0.6], // Deep purple
    Teal_ish: [45, 130, 100, 0.6], // Teal-ish
    Indigo: [100, 45, 130, 0.6], // Indigo
    Rust: [130, 75, 45, 0.6], // Rust
    Muted_blue: [60, 90, 150, 0.6], // Muted blue
    Muted_pink: [150, 60, 90, 0.6], // Muted pink
    Muted_green: [60, 150, 90, 0.6], // Muted green
    Burnt_orange: [150, 90, 60, 0.6], // Burnt orange
    Dark_violet: [90, 60, 150, 0.6], // Dark violet
    Dark_lime: [90, 150, 60, 0.6], // Dark lime green
    Dark_rose: [120, 60, 120, 0.6], // Dark rose
    Normal: [124, 181, 255, 0.0745], // Default
}

export type ColorEnum = keyof typeof colorMap

export const getColorRgba = (colorKey: ColorEnum) => {
    const colorArray = colorMap[colorKey]
    if (colorArray) {
        return `rgba(${colorArray.join(',')})`
    }
    // Return a default if the key is somehow missing (shouldn't happen with the type guard)
    return 'none'
}
