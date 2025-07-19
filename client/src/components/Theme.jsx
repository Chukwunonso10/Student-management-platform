import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'


export default function Toggletheme(){
        const [dark, setDark ] = useState(()=>{
        const theme = localStorage.getItem('theme')
        return theme === 'dark'
    })

    useEffect(()=>{
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        }else{
            root.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
        }, [dark])

       

     return (
        <div>
            <Button variant="ghost" size="sm
            " onClick={ ()=> setDark(!dark)}>
                {dark ? <Sun size={18} /> : <Moon className='h-5 w-5'/>}
            </Button>
        </div>
        )

}