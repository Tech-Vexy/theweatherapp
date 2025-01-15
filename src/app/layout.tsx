import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/Header'
import Head from 'next/head'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Weather App - Real-time Weather Updates and Forecasts',
  description: 'Get accurate, real-time weather information and forecasts for locations worldwide. Plan your day with our user-friendly weather app.',
  keywords: 'weather, forecast, temperature, precipitation, wind speed, humidity, real-time weather, global weather',
  author: 'Your Name',
  openGraph: {
    title: 'Weather App - Real-time Weather Updates and Forecasts',
    description: 'Get accurate, real-time weather information and forecasts for locations worldwide.',
    type: 'website',
    url: 'https://your-weather-app-url.com',
    image: 'https://your-weather-app-url.com/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weather App - Real-time Weather Updates and Forecasts',
    description: 'Get accurate, real-time weather information and forecasts for locations worldwide.',
    image: 'https://your-weather-app-url.com/twitter-image.jpg',
  },
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a237e" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </Head>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <footer className="bg-primary text-primary-foreground py-4 mt-8">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} Weather App. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </ThemeProvider>
      </body>
      </html>
  )
}

