import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {Anthropic} from "@anthropic-ai/sdk";
import { streamText, StreamingTextResponse } from 'ai';
import { anthropic as anthropicClient } from '@ai-sdk/anthropic';
//import { NextApiResponse } from 'next';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// const openai = new OpenAI({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

export async function POST(request: Request) {
    const { contentType } = await request.json();
  
    const encoder = new TextEncoder();
    const {readable, writable} = new TransformStream();
    const writer = writable.getWriter();
  
    const streamResponse = new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  
    // const writeChunk = async (chunk) => {
    //   await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
    // };
  
    try {
      const anthropicStream = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          { role: "assistant", content: "You are a helpful assistant that generates HTML content based on user requests." },
          { role: "user", content: `Generate HTML content for: ${contentType}` }
        ],
        stream: true,
      });
  
      let fullContent = '';
  
      for await (const chunk of anthropicStream) {
        console.log('Received chunk:', chunk);
        if (chunk.type === 'content_block_start' || chunk.type === 'content_block_delta') {
          if (chunk.delta?.text) {
            const chunkContent = chunk.delta.text;
            fullContent += chunkContent;
            console.log('Full content:', fullContent);
            //await writeChunk({ content: chunkContent, fullContent });
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content: chunkContent, fullContent })}\n\n`));
          }
        }
      }
  
      await writeChunk({ done: true });
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      await writeChunk({ error: 'Error generating content' });
    } finally {
      await writer.close();
    }
  
    return streamResponse;
  }


export async function GET() {
    
    // Create a new TransformStream
    const { readable, writable } = new TransformStream();
    const encoder = new TextEncoder();

    // Write to the writable stream in an asynchronous manner
    const writer = writable.getWriter();

    writer.write(encoder.encode('data: hello world\n\n'));
    // const anthropicStream = await anthropic.messages.stream({
    //     model: "claude-3-sonnet-20240229",
    //     max_tokens: 1000,
    //     messages: [
    //       { role: "assistant", content: "You are a helpful assistant that generates HTML content based on user requests." },
    //       { role: "user", content: `Generate HTML content for: create a title and a one sentence description for a coffee house web site` }
    //     ],
    //     stream: true,
    //   })
    //   .on('contentBlock', (content) => console.log('contentBlock', content))
    //   // Once a message is fully streamed, this event will fire
    //   .on('message', (message) => console.log('message', message));

    // anthropicStream.on('content_block_delta', (chunk) => {
    //     console.log('Received chunk:', chunk);
    //     writer.write(`data: ${JSON.stringify({ content: chunk.delta?.text })}\n\n`);
    // });

    const result = await streamText({
        model: anthropicClient("claude-3-sonnet-20240229"),
        messages: [
            { role: "assistant", content: "You are a helpful assistant that generates HTML content based on user requests." },
            { role: "user", content: `Generate HTML content for: create a title and a one sentence description for a coffee house web site` }
        ],
    });

    // for await (const textPart of result.textStream) {
    //     console.log(textPart);
    //   }
    
    // const reader = result.textStream.getReader();
    // while (true) {
    //     const {done, value} = await reader.read();
    //     if (done) break;
    //     console.log(value);
    // }
    
    //return result.toTextStreamResponse();
    return new NextResponse(result.textStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
              },
        });


    // //const chunks = [];
    // for await (const chunk of anthropicStream) {
    //     console.log('Received chunk:', chunk);
    //     //chunks.push(chunk);
    //     //await new Promise((resolve) => setTimeout(resolve, 500));
    //     if (chunk.type === 'content_block_delta') {
    //         await new Promise((resolve) => setTimeout(resolve, 50));
    //         await writer.write(`data: ${JSON.stringify({ content: chunk.delta?.text })}\n\n`);
    //     }
    //     //await writer.write(JSON.stringify(chunk));
    // }
    // writer.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    // writer.close();
    // // Function to simulate streaming and transforming data
    // async function writeStream() {
        // for (let i = 0; i < chunks.length; i++) {
        //     if (chunks[i].type === 'content_block_delta') {
        //         await writer.write(encoder.encode(chunks[i].delta?.text));
        //     }
        // }
        // Sending multiple chunks of transformed data
        // for (let i = 1; i <= 5; i++) {
        //     const chunk = `Chunk ${i}: Original data\n`;

        //     // Simulate some transformation of the chunk
        //     const transformedChunk = `Transformed: ${chunk}`;

        //     // Write the transformed chunk to the stream
        //     await writer.write(transformedChunk);
        //     //await writer.write(JSON.stringify(chunks[i]));

        //     // Simulate some delay for streaming effect
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        // }

        // Close the writer when done
    //     writer.close();
    // }

    // Start writing to the stream asynchronously
    //writeStream();
    
    // Use NextResponse to return the readable side of the stream
    // return new NextResponse(result.toDataStreamResponse(), {
    //     headers: {
    //         'Content-Type': 'text/event-stream',
    //         'Cache-Control': 'no-cache, no-transform',
    //         'Connection': 'keep-alive',
    //       },
    // });
}
