'use client'
import { useDarkMode } from '@/utils/DarkmodeContext';


export default function page() {
  const {darkMode, toggleDarkmode} = useDarkMode();
  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode && "dark"} bg-bg dark:bg-black`}>
      <button className='w-[10rem] h-[1rem] cursor-pointer bg-black dark:bg-bg dark:border-bg text-white rounded-lg p-4 flex items-center' onClick={toggleDarkmode}>
        <span className='text-bg dark:text-black'>Toggle darkmode</span>
        </button>
      <h1 className='dark:text-bg'>edit me</h1>
    </div>
  )
}
