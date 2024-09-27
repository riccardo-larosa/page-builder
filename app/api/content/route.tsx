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
            },
            //cache: 'no-store',
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

export async function PUT(request: NextRequest) {
    const data = await request.json();
    console.log(`data: ${data.data.id}`);
    console.log(JSON.stringify(data));
    const token = await getToken();
    console.log(`token: ${token}`);
    const base_url = process.env.API_BASE_URL;
    //const url_str = `${base_url}/v2/settings/extensions/custom-apis/c122d9e2-94fa-4559-91a9-2634ced36473/entries/${data.data.id}`;
    // TODO: I think there is a bug in the API, it should be like this:
    const url_str = `${base_url}/v2/extensions/store-content/${data.data.content_id}`;
    console.log(`url_str: ${url_str}`);
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
    console.log(results);
    return Response.json(results);
}

