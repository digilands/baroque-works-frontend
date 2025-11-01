
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
       <main className="min-h-screen bg-bg md:-mx-6">
        {children}
      </main>
     );
}
