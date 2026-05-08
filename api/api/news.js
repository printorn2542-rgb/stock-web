export default async function handler(req, res) {
  try {
    const symbol = String(req.query.symbol || '').toUpperCase().trim();

    if (!/^[A-Z]{1,8}$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid symbol' });
    }

    const token = process.env.FINNHUB_TOKEN;

    if (!token) {
      return res.status(500).json({ error: 'Missing FINNHUB_TOKEN' });
    }

    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);

    const toStr = today.toISOString().slice(0, 10);
    const fromStr = from.toISOString().slice(0, 10);

    const url =
      'https://finnhub.io/api/v1/company-news?symbol=' +
      encodeURIComponent(symbol) +
      '&from=' +
      fromStr +
      '&to=' +
      toStr +
      '&token=' +
      encodeURIComponent(token);

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(Array.isArray(data) ? data.slice(0, 5) : []);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
