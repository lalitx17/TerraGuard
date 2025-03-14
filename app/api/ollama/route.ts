import { NextResponse } from "next/server";
import { Ollama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log(messages);

    const ollama = new Ollama({
      baseUrl: process.env.OLLAMA_API_URL,
      model: "mistral",
      temperature: 0,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a Terraform expert. Analyze the provided Terraform configuration code and associated error. Respond only with the corrected code to fix the error. Do not include any explanations or comments in your response.",
      ],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(ollama);

    const lastMessage = messages[messages.length - 1].content;

    const response = await chain.invoke({
      input: lastMessage,
    });

    console.log("Response from Ollama:", response);

    return NextResponse.json({
      response: response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while processing the request",
        details: error,
      },
      { status: 500 },
    );
  }
}
