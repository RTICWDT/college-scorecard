import { useTheme, useDisplay } from 'vuetify'

export function useVuetify() {
  const theme = useTheme()
  const breakpoints = useDisplay()

  const color = (colorName, alpha = 1) => {
    const hexColor = theme.current.value.colors[colorName]
    
    if (alpha === 1) {
      return hexColor
    }

    // Convert hex to rgba
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return {
    theme,
    color,
    breakpoints
  }
}