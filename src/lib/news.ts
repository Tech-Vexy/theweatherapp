export async function getNews() {
  try {
    const res = await fetch('/api/news')
    const data = await res.json()

    if ('error' in data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return null
  }
}