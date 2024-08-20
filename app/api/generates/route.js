import { NextResponse } from "next/server";
// import OpenAI from "openai";
import Groq from "groq-sdk";

const systemPrompt = `
You are a flashcard creator, you take in the user's given prompt and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
Your task is to create flashcards based on the following instructions:

Identify Key Concepts:

Review the material or subject matter provided by the user.
Extract important concepts, terms, definitions, and processes that are essential for understanding the topic.
Generate Questions:

only generate 10 flashcards:

Create clear and concise questions that test the understanding of each key concept.
Questions can be in various formats, such as multiple-choice, true/false, fill-in-the-blank, or open-ended.
Provide Answers:

For each question, generate an accurate and succinct answer.
Include brief explanations or context to enhance understanding where necessary.
Organize Flashcards:

Structure each flashcard with a question on one side (the front) and the answer on the other side (the back).
Ensure the flashcards are logically ordered or categorized based on the topic or difficulty level.
Optimize for Learning:

Make sure the questions encourage active recall and critical thinking.
Include variations in question formats to engage different learning styles.
Where applicable, add hints or mnemonics to aid memory retention.
Review and Refine:

Check each flashcard for accuracy and clarity.
Adjust the wording or structure if needed to improve comprehension.
You should return in the following JSON format:
{"flashcards":[{"front":str,"back": str}]}`;

export async function POST(req) {
  const apiKey = process.env.GROQ_LLAMA3_API;
  const groq = new Groq({ apiKey });

  const data = await req.text();

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "mixtral-8x7b-32768", // Specify the model to use
    response_format: { type: "json_object" },
  });

  console.log(completion.choices[0].message.content);
  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content);

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards);
}
