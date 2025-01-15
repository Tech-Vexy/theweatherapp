'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react'
import Image from 'next/image'
import { getNews } from '@/lib/news'

interface NewsItem {
  title: string
  description: string
  url: string
  urlToImage?: string
}

export function NewsCarousel() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      const newsData = await getNews()
      setNews(newsData || [])
      setIsLoading(false)
    }
    fetchNews()
  }, [])

  useEffect(() => {
    const timer = setInterval(nextNews, 5000)
    return () => clearInterval(timer)
  }, [news.length])

  const nextNews = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length)
  }

  const prevNews = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length)
  }

  if (isLoading) {
    return <div className="text-center py-8 text-sm font-medium text-gray-600 dark:text-gray-300">Loading news...</div>
  }

  if (news.length === 0) {
    return <div className="text-center py-8 text-sm font-medium text-gray-600 dark:text-gray-300">No news available</div>
  }

  return (
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Newspaper className="mr-2" />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 relative">
          <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {news.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0 p-3">
                  <Card className="overflow-hidden relative h-48 md:h-64 shadow-md rounded-lg transform transition-transform duration-300 hover:scale-[1.02]">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                      <div className="relative h-full">
                        <Image
                            src={item.urlToImage || '/placeholder.svg?height=400&width=600'}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-sm line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    </a>
                  </Card>
                </div>
            ))}
          </div>
          <button
              onClick={prevNews}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:scale-110"
              aria-label="Previous news"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
              onClick={nextNews}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:scale-110"
              aria-label="Next news"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </CardContent>
      </Card>
  )
}

