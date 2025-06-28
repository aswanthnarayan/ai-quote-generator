'use client';
import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Copy, Check, Linkedin, Instagram, Facebook, X } from 'lucide-react';

type Platform = 'instagram' | 'facebook' | 'linkedin';

const platforms = {
  instagram: { icon: Instagram, name: 'Instagram', color: 'from-pink-500 to-purple-600' },
  facebook: { icon: Facebook, name: 'Facebook', color: 'from-blue-500 to-blue-700' },
  linkedin: { icon: Linkedin, name: 'LinkedIn', color: 'from-blue-400 to-blue-600' },
};

export default function UploadPage() {
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setCaptions([]);
    setError('');
    setCopiedIndex(null);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;

    if (!imageFile || imageFile.size === 0) {
      setError('Please select an image to upload.');
      return;
    }

    setLoading(true);
    setCaptions([]);
    setError('');
    setCopiedIndex(null);
    formData.append('platform', selectedPlatform);

    try {
      const res = await fetch('/api/caption', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.captions && Array.isArray(data.captions)) {
        setCaptions(data.captions);
      } else {
        setError('Failed to generate captions. Please try again.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans antialiased">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                AI Quote Generator
              </h1>
              <p className="mt-1.5 text-sm text-gray-400">Transform your images into engaging social media content</p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-2">
              <a 
                href="https://github.com/aswanthnarayan/ai-quote-generator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
         
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Create Your Quote</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">1. Choose Platform</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {(Object.keys(platforms) as Platform[]).map((platform) => {
                      const { icon: Icon, name, color } = platforms[platform];
                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setSelectedPlatform(platform)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                            selectedPlatform === platform
                              ? `bg-gradient-to-r ${color} text-white shadow-lg shadow-${color.split(' ')[0]}/20`
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700/80'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">2. Upload Image</h3>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-xl border-2 border-dashed ${
                      isDragging ? 'border-purple-500 bg-gray-800/50' : 'border-gray-700 hover:border-gray-600'
                    } transition-colors duration-200 cursor-pointer`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute top-3 right-3 p-1.5 bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="w-5 h-5 text-gray-300" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="p-3 mb-3 rounded-full bg-gray-800/50">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-400 mb-1">
                          <span className="font-medium text-purple-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, or GIF (max. 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      id="dropzone-file"
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !previewUrl}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-300 ${
                    loading || !previewUrl
                      ? 'bg-gray-700 cursor-not-allowed'
                      : `bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:shadow-purple-500/20`
                  } flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Quotes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-6 text-center">Your AI-Generated Quotes</h2>
              
              <div className="flex-1 flex flex-col justify-center">
                {loading ? (
                  <div className="space-y-6 text-center">
                    <div className="flex justify-center space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-gray-400">Generating creative quotes for {platforms[selectedPlatform].name}...</p>
                  </div>
                ) : error ? (
                  <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-xl text-red-200 text-sm">
                    <p className="font-medium">Something went wrong</p>
                    <p className="mt-1 text-red-300">{error}</p>
                  </div>
                ) : captions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">
                        {captions.length} {captions.length === 1 ? 'quote' : 'quotes'} generated
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(captions.join('\n\n'));
                          setCopiedIndex(-1);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        {copiedIndex === -1 ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        Copy All
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                      {captions.map((caption, index) => (
                        <div 
                          key={index} 
                          className="relative p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors group"
                        >
                          <p className="text-gray-200 italic">"{caption}"</p>
                          <button
                            onClick={() => handleCopy(caption, index)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-800/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700/80"
                            aria-label="Copy quote"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No quotes yet</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      Upload an image and generate creative quotes for {platforms[selectedPlatform].name}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 pb-8 text-center">
        <p className="text-sm text-gray-500">
          Made with <span className="text-pink-400">♥</span> by Aswanth • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

