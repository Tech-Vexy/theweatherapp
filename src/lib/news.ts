const API_KEY = "e99bec0cdfbf476eb6c0f6edeafeae35"

export async function getNews() {
  const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  )
  const data = await res.json()

  if (data.status !== 'ok') {
    return null
  }

  return data.articles.slice(0, 5).map((article: any) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    urlToImage: article.urlToImage,
  }))
}

