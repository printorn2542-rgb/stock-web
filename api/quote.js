export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const symbol = String(req.query.symbol || '').toUpperCase().trim();

    if (!/^[A-Z]{1,8}$/.test(symbol)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid symbol'
      });
    }

    const token = process.env.FINNHUB_TOKEN;

    if (!token) {
      return res.status(500).json({
        ok: false,
        error: 'Missing FINNHUB_TOKEN'
      });
    }

    const url =
      'https://finnhub.io/api/v1/quote?symbol=' +
      encodeURIComponent(symbol) +
      '&token=' +
      encodeURIComponent(token);

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.c || Number(data.c) <= 0) {
      return res.status(200).json({
        ok: false,
        error: 'No quote data',
        symbol,
        raw: data
      });
    }

    return res.status(200).json({
      ...data,
      ok: true,
      symbol,
      source: 'Finnhub'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch quote'
    });
  }
}
