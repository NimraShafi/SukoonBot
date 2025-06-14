import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyCWt-2EjDSq7wfbl3q2sygUgE2F3DpKZOI"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

export async function POST(request: NextRequest) {
  try {
    const { message, language, context } = await request.json()

    const systemPrompt =
      language === "ur"
        ? `آپ ایک ہمدرد اور تجربہ کار ذہنی صحت کے مشیر ہیں جو جنوبی ایشیائی کمیونٹی کے لیے خصوصی طور پر تربیت یافتہ ہیں۔ آپ CBT، DBT، اور trauma-informed care کی تکنیکوں کا استعمال کرتے ہیں۔ ہمیشہ اردو میں جواب دیں اور ثقافتی حساسیت کا خیال رکھیں۔ آپ کا نام سکون بوٹ ہے۔`
        : `You are SukoonBot, a compassionate and experienced mental health counselor specifically trained for South Asian communities. You use CBT, DBT, and trauma-informed care techniques. Always respond in English and be culturally sensitive. Keep responses supportive, empathetic, and helpful. Limit responses to 2-3 paragraphs.`

    const fullPrompt = `${systemPrompt}\n\nUser message: ${message}\n\nPlease provide a supportive and helpful response:`

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API error: ${response.status} - ${errorText}`)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract the response text from Gemini's response format
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      console.error("No response text found in Gemini response:", data)
      throw new Error("No response generated")
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Chat API error:", error)

    // Provide fallback responses based on language
    const fallbackResponse =
      (await request.json()).language === "ur"
        ? "معذرت، میں اس وقت جواب نہیں دے سکتا۔ براہ کرم دوبارہ کوشش کریں۔ اگر آپ کو فوری مدد کی ضرورت ہے تو کسی ماہر نفسیات سے رابطہ کریں۔"
        : "I apologize, but I'm having trouble responding right now. Please try again in a moment. If you need immediate support, please reach out to a mental health professional or crisis helpline."

    return NextResponse.json(
      {
        response: fallbackResponse,
        error: "API temporarily unavailable",
      },
      { status: 200 },
    ) // Return 200 to avoid breaking the UI
  }
}
