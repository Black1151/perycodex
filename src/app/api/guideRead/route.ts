import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BE_URL;
if (!BACKEND_URL) throw new Error('Missing BE_URL environment variable');

interface GuideReadPayload {
  id: number
  guideId: string | number;
  customerId: string | number;
  userId: string | number;
}

async function forwardToBackend(
  method: 'GET' | 'POST' | 'DELETE',
  payload: GuideReadPayload | null
): Promise<NextResponse> {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  let url: string;
  if (method === 'GET') {
    url = `${BACKEND_URL}/guideRead/allBy`;
  } else if (method === 'DELETE' && payload) {
    url = `${BACKEND_URL}/guideRead/${payload.id}`;
  } else {
    // POST
    url = `${BACKEND_URL}/guideRead`;
  }
  console.log(`[guideRead] ${method} → ${url}`);

  const fetchOpts: RequestInit = { method, headers: {} };

  if (authToken) {
    fetchOpts.headers = { Authorization: `Bearer ${authToken}` };
    console.log(`[guideRead] Added Authorization header`);
  } else {
    console.log(`[guideRead] No auth token found`);
  }

  if (method !== 'GET' && payload) {
    fetchOpts.headers = { ...fetchOpts.headers, 'Content-Type': 'application/json' };
    fetchOpts.body = JSON.stringify(payload);
    console.log(`[guideRead] ${method} payload: ${JSON.stringify(payload)}`);
  }

  try {
    const res = await fetch(url, fetchOpts);
    console.log(`[guideRead] Response status: ${res.status}`);

    let data: any;
    try {
      data = await res.json();
      console.log(`[guideRead] Response JSON: ${JSON.stringify(data)}`);
    } catch (jsonErr) {
      console.log(`[guideRead] JSON parse error: ${jsonErr}`);
      return NextResponse.json({ error: 'Invalid JSON from backend' }, { status: 502 });
    }

    if (!res.ok) {
      console.log(`[guideRead] Backend error: ${data.error || 'Unknown error'}`);
      return NextResponse.json({ error: data.error ?? 'Backend error' }, { status: res.status });
    }

    console.log(`[guideRead] Success, returning resource`);
    return NextResponse.json({ resource: data.resource ?? null });
  } catch (err: any) {
    console.log(`[guideRead] Network error: ${err.message}`);
    return NextResponse.json({ error: err.message ?? 'Network error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('[guideRead][POST] Handler start');
  try {
    const payload = (await req.json()) as GuideReadPayload;
    console.log(`[guideRead][POST] Received payload: ${JSON.stringify(payload)}`);
    return forwardToBackend('POST', payload);
  } catch (err: any) {
    console.log(`[guideRead][POST] Body parse error: ${err.message}`);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  console.log('[guideRead][DELETE] Handler start');
  try {
    const payload = (await req.json()) as GuideReadPayload;
    console.log(`[guideRead][DELETE] Received payload: ${JSON.stringify(payload)}`);
    return forwardToBackend('DELETE', payload);
  } catch (err: any) {
    console.log(`[guideRead][DELETE] Body parse error: ${err.message}`);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function GET(_req: NextRequest) {
  console.log('[guideRead][GET] Handler start');
  return forwardToBackend('GET', null);
}
