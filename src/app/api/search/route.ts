import { NextRequest, NextResponse } from 'next/server';

const MEILI_URL = `${process.env.MEILISEARCH_URL}/indexes/stocks/search`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(MEILI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MEILISEARCH_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Meilisearch error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Search failed'+ err }, { status: 500 });
  }
}