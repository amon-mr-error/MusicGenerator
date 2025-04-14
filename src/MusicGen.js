import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Headphones, Music, Loader, Mic } from 'lucide-react';

function MusicGen() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [presets, setPresets] = useState([
    "Sultry jazz with deep bass and saxophone",
    "Seductive R&B with smooth vocals",
    "Passionate Latin dance rhythm with flamenco guitar",
    "Sensual electronic beats with breathy vocals",
    "Dreamy ambient soundscape with soft piano"
  ]);
  
  
  
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = muted ? 0 : volume;
    }
  }, [volume, muted, audioElement]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setAudioUrl('');
    
    try {
      // POST request to your Flask backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      // Convert the received data (audio file) into a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error generating music:", error);
      alert("There was an error generating the music.");
    }
    
    setLoading(false);
  };
  
  const handleAudioRef = (element) => {
    if (element) {
      element.volume = volume;
      setAudioElement(element);
      
      element.onplay = () => setIsPlaying(true);
      element.onpause = () => setIsPlaying(false);
      element.onended = () => setIsPlaying(false);
    }
  };
  
  const toggleMute = () => {
    setMuted(!muted);
    if (audioElement) {
      audioElement.volume = !muted ? 0 : volume;
    }
  };
  
  const applyPreset = (preset) => {
    setPrompt(preset);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Headphones size={32} className="text-pink-500" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-400">
            Sensual Soundscape Creator
          </h1>
        </div>
        
        <div className="mb-8">
          <p className="text-lg text-purple-300 mb-4">
            Transform your desires into captivating audio experiences
          </p>
        </div>
        
        <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-purple-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                rows="3"
                placeholder="Describe your perfect sound experience..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-gray-900 text-white border border-purple-600 rounded-lg p-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-3 bottom-3">
                <Mic className="text-pink-500" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 my-4">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-sm rounded-full transition-all"
                >
                  {preset}
                </button>
              ))}
            </div>
            
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                loading || !prompt.trim() 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500'
              }`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" />
                  <span>Creating your experience...</span>
                </>
              ) : (
                <>
                  <Music />
                  <span>Generate Your Soundscape</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        {audioUrl && (
          <div className="mt-8 bg-black bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-purple-800 transition-all">
            <h2 className="text-2xl font-bold mb-4 text-pink-400">Your Custom Soundscape</h2>
            
            <div className="relative">
              <audio 
                ref={handleAudioRef}
                controls 
                src={audioUrl}
                className="w-full"
              >
                Your browser does not support the audio element.
              </audio>
              
              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={toggleMute} 
                  className="p-2 rounded-full bg-purple-800 hover:bg-purple-700 transition-all"
                >
                  {muted ? <VolumeX /> : <Volume2 />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                  disabled={muted}
                />
              </div>
              
              <div className="mt-6 p-4 bg-purple-900 bg-opacity-40 rounded-lg">
                <p className="text-purple-300 italic">
                  "{prompt}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicGen;