import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Recetas App',
  description: 'Comparte tus recetas favoritas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

