import { type NextRequest } from 'next/server'

export interface ContentItem {
    id: string;
    content_id: string;
    name: string;
    page: string;
    status: string;
    content: string;
    last_modified_at: string;
}

async function getToken() {

    const clientid = process.env.CLIENTID; 
    const clientsecret = process.env.CLIENTSECRET;
    if (!clientid || !clientsecret) {
        throw new Error('CLIENTID and CLIENTSECRET must be defined in environment variables');
    }
    // Create URLSearchParams for form-encoded data
    const data = new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': clientid,
        'client_secret': clientsecret
    } as Record<string, string>);

    // Using fetch to make the POST request
    const url = process.env.API_BASE_URL;
    const response = await fetch(`${url}/oauth/access_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: data // Send the form-encoded data in the body
    })
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const results = await response.json();
    return results.access_token;
    
}
export async function GET(request: NextRequest) {

    const params = request.nextUrl.searchParams;
    console.log(`params: ${params}`);
    //const pageName = params.get('pageName');
    const token = await getToken();
    const base_url = process.env.API_BASE_URL;
    //console.log(token);
    const url_str = `${base_url}/v2/extensions/store-content?${params}`;
    //console.log(url_str);
    const response = await fetch(
        url_str,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    const pageContent = data.data;
    // return a json object that contains an array of content, id and page
    const content = pageContent.map((item: any) => ({
        id: item.id,
        content_id: item.content_id,
        page: item.page,
        name: item.name,
        status: item.status,
        content: item.content,
        html: item.html,
        last_modified_at: item.meta.timestamps.updated_at
    }));
    //console.log(content);
    return Response.json(content)
}

async function createContentVersion(token: string, data: any) {
    const base_url = process.env.API_BASE_URL;
    const data_versions = {
        content_id: data.data.content_id,
        content: data.data.content,
        html: data.data.html,
        type: 'content_version_ext',
    }
    const url_str_versions = `${base_url}/v2/extensions/content-versions`;
    const response_versions = await fetch(url_str_versions, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({data: data_versions})
    });
    if (!response_versions.ok) {
        throw new Error(`Error: ${response_versions.statusText}`);
    }
    return response_versions;
}

export async function PUT(request: NextRequest) {
    const data = await request.json();
    const token = await getToken();
    const base_url = process.env.API_BASE_URL;
    const url_str = `${base_url}/v2/extensions/store-content/${data.data.content_id}`;
    const response = await fetch(url_str, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const results = await response.json();
    await createContentVersion(token, data);
    return Response.json(results);
}

export async function POST(request: NextRequest) {

    const data = await request.json();
    const { content_id, name } = data;
    if (!content_id || !name) {
      return Response.json({ error: 'Content ID and name are required' }, { status: 400 });
    }
    if (!data.status) {
        data.status = 'draft';
    }
    //TODO: ask Steve about this
    data.type = 'store_content_ext';
    const token = await getToken();
    const base_url = process.env.API_BASE_URL;
    const url_str = `${base_url}/v2/extensions/store-content`;
    const response = await fetch(url_str, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({data: data})
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    const results = await response.json();
    return Response.json(results);
}

export async function DELETE(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const token = await getToken();
    const base_url = process.env.API_BASE_URL;
    const url_str = `${base_url}/v2/extensions/store-content/${params.get('content_id')}`;
    const response = await fetch(url_str, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return Response.json({message: 'Content deleted successfully'});
}