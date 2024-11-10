import { NextRequest } from 'next/server';
import { getToken } from '../../route';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = await getToken();
    const base_url = process.env.API_BASE_URL;
    const url_str = `${base_url}/v2/extensions/content-versions?filter=like(content_id,${params.id})`;
    const response = await fetch(
        url_str,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
    );

    const data = await response.json();
    return Response.json(data);
} 