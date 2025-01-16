import { NextResponse } from 'next/server'

const API_KEY = process.env.NEWS_API_KEY

export async function GET() {
    try {
        const res = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
        )
        const data = await res.json()

        if (data.status !== 'ok') {
            return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
        }

        const articles = data.articles.slice(0, 5).map((article: any) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
        }))

        return NextResponse.json(articles)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
    }
}