'use client'
import Header from '../ui/Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-5">
        {children}
      </main>
    </>
  )
}