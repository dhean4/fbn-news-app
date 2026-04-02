export default async function handler(req, res) {
  const params = new URLSearchParams(req.query);
  params.delete('apiKey');
  params.set('apiKey', process.env.NEWS_API_KEY ?? '');

  const upstream = `https://newsapi.org/v2/top-headlines?${params.toString()}`;

  try {
    const response = await fetch(upstream);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ status: 'error', message: 'Failed to reach news provider.' });
  }
}
