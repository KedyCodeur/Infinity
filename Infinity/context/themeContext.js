
import { createContext, useContext, useState, useEffect } from 'react'
import { storageGetItem, storageSetItem } from '@/utils/storage'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const load = async () => {
            const saved = await storageGetItem("theme")
            if (saved !== null) setIsDark(saved)
                console.log(saved)
        }
        load()
    }, [])

    const toggleTheme = async () => {
        const newValue = !isDark
        setIsDark(newValue)
        await storageSetItem("theme", newValue)
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)