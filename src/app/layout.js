import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'News Website',
  description: 'Latest news and updates',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
