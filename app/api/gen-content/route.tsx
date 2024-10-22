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

    const result = await streamText({
        model: anthropicClient("claude-3-sonnet-20240229"),
        messages: [
            { role: "assistant", content: "You are a helpful assistant that generates HTML content based on user requests." },
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
