import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Function to convert a file to base64
async function fileToGenerativePart(file: File) {
  const base64EncodedData = Buffer.from(await file.arrayBuffer()).toString('base64');
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const platform = formData.get('platform') as string || 'general';

    if (!image) {
      return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing. Please provide your own key or configure one on the server.' }, { status: 400 });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Generate 5 short, catchy and creative quotes for the following image, tailored for a ${platform} post. The quotes should be inspiring, witty, or thought-provoking. Return the output as a JSON array of strings. For example: ["This is the first quote.", "This is the second quote."]. Do not include any other text or markdown formatting in your response, only the JSON array.`;

    const imagePart = await fileToGenerativePart(image);

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    let text = response.text();

    // clean up the response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const captions = JSON.parse(text);
      return NextResponse.json({ captions });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Original AI response text:', text);
      // fallback: try to split by newline if JSON parsing fails
      const fallbackCaptions = text.split('\n').map(q => q.replace(/^- |"|,/g, '').trim()).filter(Boolean);
      if (fallbackCaptions.length > 0) {
        return NextResponse.json({ captions: fallbackCaptions });
      }
      return NextResponse.json({ error: 'Failed to parse generated captions.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error generating caption:', error);
    if (error.message?.includes('API key not valid')) {
        return NextResponse.json({ error: 'The provided API key is not valid. Please check your key and try again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to generate caption.' }, { status: 500 });
  }
}