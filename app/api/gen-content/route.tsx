import { NextRequest, NextResponse } from 'next/server';
//import OpenAI from 'openai';
import {Anthropic} from "@anthropic-ai/sdk";
import { streamText } from 'ai';
import { anthropic as anthropicClient } from '@ai-sdk/anthropic';
//import { NextApiResponse } from 'next';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// const openai = new OpenAI({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

export async function POST(request: Request) {
    
    const { prompt }: { prompt: string }  = await request.json();
    console.log(prompt);

    const assistantPrompt = `Your task is to create an html snippet based on the 
        given specifications, delivered as an HTML file with embedded JavaScript and 
        CSS. The generated HTML will be positioned inside the <body> of the page, 
        so you should not include any <html> or <body> tags. 
        The website may incorporate a variety of engaging and interactive design features, 
        such as drop-down menus, dynamic text and content, clickable buttons, and more. 
        Ensure that the design is visually appealing, responsive, and user-friendly. 
        The HTML, CSS, and JavaScript code should be well-structured, efficiently organized,
        and properly commented for readability and maintainability.
        The generated HTML should be a valid snippet that can be embedded in an existing HTML document.
        Snippets may be modified by the user and are displayed in a separate UI window for clarity.
        Wrap the snippet in <snippet> tags. Assign a unique id to the snippet.
        Images from the web are not allowed, but you can use placeholder images by specifying 
        the width and height like so <img src="/images/placeholder/400/320" alt="placeholder" />.
        The user interface will render the Scalable Vector Graphics (SVG) image within the artifact tags. 
        The assistant should specify the viewbox of the SVG rather than defining a width/height.
        Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. h-[600px]).
        `;
    const result = await streamText({
        model: anthropicClient("claude-3-5-sonnet-20241022"),
        messages: [
            { role: "assistant", content: assistantPrompt },
            { role: "user", content: `Generate HTML content for: ${prompt}` }
        ],
    });
    
    return result.toDataStreamResponse();
    // const streamResponse = new NextResponse(result.textStream, {
    //     headers: {
    //       'Content-Type': 'text/event-stream',
    //       'Cache-Control': 'no-cache, no-transform',
    //       'Connection': 'keep-alive',
    //     },
    //   });
    // return streamResponse;
  }


export async function GET() {
    
    const result = await streamText({
        model: anthropicClient("claude-3-sonnet-20240229"),
        messages: [
            { role: "assistant", content: "You are a helpful assistant that generates HTML content based on user requests." },
            { role: "user", content: `Generate HTML content for: create a title and a one sentence description for a coffee house web site` }
        ],
    });

    //return result.toTextStreamResponse();
    return new NextResponse(result.textStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
              },
        });


}
