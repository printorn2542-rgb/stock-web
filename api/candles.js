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

    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 45;

    const url =
      'https://finnhub.io/api/v1/stock/candle?symbol=' +
      encodeURIComponent(symbol) +
      '&resolution=D' +
      '&from=' +
      from +
      '&to=' +
      to +
      '&token=' +
      encodeURIComponent(token);

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch candles' });
  }
}
