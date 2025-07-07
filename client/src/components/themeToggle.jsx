import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'

export default function ThemeToggle() {
    const [dark, setDark ] = useState(()=>{
        const savedTheme = localStorage.getItem('theme')
        return (savedTheme === 'dark')
    })

    useEffect(() =>{
        const root = document.documentElement
        if (dark) {
            root.classList.add('dark')
            localStorage.setItem("theme", "dark")
        }else{
            root.classList.remove('dark')
            localStorage.setItem("theme", "light")
        }
    }, [dark])

    return (
        <div>
            <Button variant="ghost" size="icon" onClick={ ()=> setDark(!dark)}>
                {dark ? <SunIcon className='h-5 w-5 flex items-end' /> : <MoonIcon className='h-5 w-5'/>}
            </Button>
        </div>
    )
}