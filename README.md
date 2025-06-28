# AI Quote Generator

A modern web application that generates engaging social media quotes using AI. Upload an image, and let the AI craft perfect captions for Instagram, Facebook, or LinkedIn.

[![Live Demo](https://)

![Screenshot](/public/screenshot.png)

## Features

- 🖼️ Drag and drop image upload
- 🤖 AI-powered quote generation
- 📱 Platform-specific formatting (Instagram, Facebook, LinkedIn)
- 📋 One-click copy to clipboard
- 🎨 Modern, responsive UI 
- ⚡ Fast and efficient with Next.js 14

## Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Google Gemini API key

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/aswanthnarayan/ai-quote-generator.git
   cd ai-quote-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## How to Get a Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key if you don't have one
4. Copy the API key and add it to your `.env.local` file

## Environment Variables

| Variable Name | Description |
|---------------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Icons**: Lucide Icons
- **Deployment**: Vercel

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Google Gemini](https://ai.google.dev/) for the AI capabilities
- [Vercel](https://vercel.com) for the hosting platform

---

Made with ❤️ by Aswanth
