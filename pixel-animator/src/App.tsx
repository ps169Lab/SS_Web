/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Play, 
  Pause, 
  Download, 
  Eraser, 
  Pencil, 
  Undo, 
  Redo,
  ChevronLeft,
  ChevronRight,
  Settings,
  Grid3X3,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import GIF from 'gif.js';
import gifshot from 'gifshot';

const DEFAULT_COLOR = '#000000';
const EMPTY_COLOR = 'transparent';

export default function App() {
  const [gridSize, setGridSize] = useState(16);
  const [frames, setFrames] = useState<string[][]>([Array(16 * 16).fill(EMPTY_COLOR)]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [brushColor, setBrushColor] = useState(DEFAULT_COLOR);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(8);
  const [history, setHistory] = useState<string[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExporting, setIsExporting] = useState(false);
  const [pendingGridSize, setPendingGridSize] = useState<number | null>(null);

  const previewRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize frames when grid size changes
  useEffect(() => {
    const newFrames = [Array(gridSize * gridSize).fill(EMPTY_COLOR)];
    setFrames(newFrames);
    setCurrentFrameIndex(0);
    setHistory([newFrames]);
    setHistoryIndex(0);
  }, [gridSize]);

  // Handle dynamic grid size change with confirmation if work exists
  const handleGridSizeChange = (newSize: number) => {
    const size = Math.max(4, Math.min(64, newSize));
    const hasDrawn = frames.some(frame => frame.some(pixel => pixel !== EMPTY_COLOR));
    
    if (hasDrawn) {
      setPendingGridSize(size);
    } else {
      setGridSize(size);
    }
  };

  const confirmGridSizeChange = () => {
    if (pendingGridSize !== null) {
      setGridSize(pendingGridSize);
      setPendingGridSize(null);
    }
  };

  // Animation logic
  useEffect(() => {
    if (isPlaying) {
      const interval = 1000 / fps;
      let lastTime = 0;

      const animate = (time: number) => {
        if (!lastTime) lastTime = time;
        const delta = time - lastTime;

        if (delta >= interval) {
          setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
          lastTime = time;
        }
        previewRef.current = requestAnimationFrame(animate);
      };

      previewRef.current = requestAnimationFrame(animate);
    } else {
      if (previewRef.current) cancelAnimationFrame(previewRef.current);
    }

    return () => {
      if (previewRef.current) cancelAnimationFrame(previewRef.current);
    };
  }, [isPlaying, fps, frames.length]);

  const saveToHistory = useCallback((newFrames: string[][]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFrames)));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setFrames(JSON.parse(JSON.stringify(prev)));
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setFrames(JSON.parse(JSON.stringify(next)));
      setHistoryIndex(historyIndex + 1);
    }
  };

  const updatePixel = (index: number) => {
    const newFrames = [...frames];
    const currentFrame = [...newFrames[currentFrameIndex]];
    const color = tool === 'pencil' ? brushColor : EMPTY_COLOR;
    
    if (currentFrame[index] === color) return;
    
    currentFrame[index] = color;
    newFrames[currentFrameIndex] = currentFrame;
    setFrames(newFrames);
    saveToHistory(newFrames);
  };

  const addFrame = () => {
    const newFrames = [...frames];
    newFrames.splice(currentFrameIndex + 1, 0, Array(gridSize * gridSize).fill(EMPTY_COLOR));
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex + 1);
    saveToHistory(newFrames);
  };

  const duplicateFrame = () => {
    const newFrames = [...frames];
    newFrames.splice(currentFrameIndex + 1, 0, [...frames[currentFrameIndex]]);
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex + 1);
    saveToHistory(newFrames);
  };

  const deleteFrame = (index: number) => {
    if (frames.length <= 1) return;
    const newFrames = frames.filter((_, i) => i !== index);
    setFrames(newFrames);
    if (currentFrameIndex >= newFrames.length) {
      setCurrentFrameIndex(newFrames.length - 1);
    }
    saveToHistory(newFrames);
  };

  const downloadGIF = async () => {
    setIsExporting(true);
    
    const pixelSize = 10;
    const size = gridSize * pixelSize;
    const images: string[] = [];

    frames.forEach((frame) => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      frame.forEach((color, pixelIdx) => {
        if (color !== EMPTY_COLOR) {
          const x = (pixelIdx % gridSize) * pixelSize;
          const y = Math.floor(pixelIdx / gridSize) * pixelSize;
          tempCtx.fillStyle = color;
          tempCtx.fillRect(x, y, pixelSize, pixelSize);
        }
      });
      images.push(tempCanvas.toDataURL());
    });

    gifshot.createGIF({
      images: images,
      gifWidth: size,
      gifHeight: size,
      interval: 1 / fps,
      numWorkers: 2
    }, (obj: any) => {
      if (!obj.error) {
        const link = document.createElement('a');
        link.download = 'pixel-animation.gif';
        link.href = obj.image;
        link.click();
      } else {
        console.error('GIF export failed:', obj.error);
      }
      setIsExporting(false);
    });
  };

  const downloadSpriteSheet = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelSize = 10;
    canvas.width = gridSize * pixelSize * frames.length;
    canvas.height = gridSize * pixelSize;

    frames.forEach((frame, frameIdx) => {
      frame.forEach((color, pixelIdx) => {
        if (color !== EMPTY_COLOR) {
          const x = (frameIdx * gridSize + (pixelIdx % gridSize)) * pixelSize;
          const y = Math.floor(pixelIdx / gridSize) * pixelSize;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      });
    });

    const link = document.createElement('a');
    link.download = 'pixel-animation.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const [isMouseDown, setIsMouseDown] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="border-b border-slate-200 p-4 flex items-center justify-between bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Grid3X3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter italic uppercase text-slate-900">Pixel Animator</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grid Size</span>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={gridSize}
                onChange={(e) => handleGridSizeChange(parseInt(e.target.value) || 16)}
                className="w-12 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <span className="text-xs text-slate-400 font-mono">px</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={downloadSpriteSheet}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-slate-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button 
              onClick={downloadGIF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-orange-500/20"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? "EXPORTING..." : "GIF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Editor Area */}
        <div className="space-y-6">
          {/* Main Canvas */}
          <div className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-3xl p-8 min-h-[500px] relative overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
              backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />
            
            <div 
              className="grid gap-0 border border-slate-200 shadow-2xl shadow-slate-200 bg-slate-50"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: 'min(80vw, 480px)',
                aspectRatio: '1/1'
              }}
              onMouseDown={() => setIsMouseDown(true)}
              onMouseUp={() => setIsMouseDown(false)}
              onMouseLeave={() => setIsMouseDown(false)}
            >
              {frames[currentFrameIndex].map((color, i) => (
                <div
                  key={i}
                  onMouseDown={() => updatePixel(i)}
                  onMouseEnter={() => isMouseDown && updatePixel(i)}
                  className="w-full h-full border-[0.5px] border-slate-200/30 cursor-crosshair transition-colors duration-75"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Canvas Controls */}
            <div className="mt-8 flex items-center gap-4 bg-slate-100/80 p-2 rounded-2xl border border-slate-200 backdrop-blur-md shadow-sm">
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-white rounded-xl disabled:opacity-30 transition-all text-slate-600 shadow-sm"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 hover:bg-white rounded-xl disabled:opacity-30 transition-all text-slate-600 shadow-sm"
              >
                <Redo className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  const newFrames = [...frames];
                  newFrames[currentFrameIndex] = Array(gridSize * gridSize).fill(EMPTY_COLOR);
                  setFrames(newFrames);
                  saveToHistory(newFrames);
                }}
                className="p-2 hover:bg-red-50 text-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                title="Clear Frame"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-slate-200" />
              <button 
                onClick={() => setTool('pencil')}
                className={cn(
                  "p-2 rounded-xl transition-all shadow-sm",
                  tool === 'pencil' ? "bg-orange-500 text-white" : "hover:bg-white text-slate-600"
                )}
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setTool('eraser')}
                className={cn(
                  "p-2 rounded-xl transition-all shadow-sm",
                  tool === 'eraser' ? "bg-orange-500 text-white" : "hover:bg-white text-slate-600"
                )}
              >
                <Eraser className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-slate-200" />
              <div className="relative group">
                <input 
                  type="color" 
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-white p-1 border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Timeline</h3>
              <div className="flex gap-2">
                <button 
                  onClick={addFrame}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all text-orange-500 border border-slate-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={duplicateFrame}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 border border-slate-100"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {frames.map((frame, i) => (
                <div 
                  key={i}
                  onClick={() => setCurrentFrameIndex(i)}
                  className={cn(
                    "relative flex-shrink-0 w-24 h-24 rounded-2xl border-2 cursor-pointer transition-all overflow-hidden bg-slate-50 group",
                    currentFrameIndex === i ? "border-orange-500 scale-105 shadow-lg shadow-orange-500/10" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div 
                    className="grid w-full h-full"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                  >
                    {frame.map((color, j) => (
                      <div key={j} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFrame(i);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm backdrop-blur-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 rounded-md text-[10px] font-bold text-slate-400 shadow-sm backdrop-blur-sm">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Preview */}
        <aside className="space-y-6">
          {/* Preview Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Preview</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                {currentFrameIndex + 1} / {frames.length}
              </div>
            </div>

            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-inner">
              <div 
                className="grid w-full h-full"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              >
                {frames[currentFrameIndex].map((color, i) => (
                  <div key={i} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg",
                    isPlaying 
                      ? "bg-slate-900 text-white shadow-slate-900/20" 
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20"
                  )}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? "PAUSE" : "PLAY"}
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Playback Speed</span>
                  <span className="text-orange-500">{fps} FPS</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="24" 
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-100 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Palette / Tools */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-lg shadow-slate-200/50">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-slate-900">
              <Palette className="w-4 h-4 text-orange-500" />
              Palette
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {[
                '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
                '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#800000',
                '#808080', '#c0c0c0', '#ffd700', '#ff69b4', '#4b0082', '#00ced1'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setBrushColor(color);
                    setTool('pencil');
                  }}
                  className={cn(
                    "w-full aspect-square rounded-lg border border-slate-100 transition-all hover:scale-110 hover:shadow-md",
                    brushColor === color && "ring-2 ring-orange-500 ring-offset-2 ring-offset-white scale-110 shadow-md"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-5 rounded-3xl bg-orange-50 border border-orange-100">
            <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Pro Tip</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              GIFs can be any size! We've added a dynamic grid selector so you can create anything from tiny icons to detailed pixel scenes.
            </p>
          </div>
        </aside>
      </main>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {pendingGridSize !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingGridSize(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200"
            >
              <h3 className="text-xl font-bold mb-2">Change Grid Size?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Changing the grid size to <span className="font-bold text-slate-900">{pendingGridSize}x{pendingGridSize}</span> will clear your current animation. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPendingGridSize(null)}
                  className="flex-1 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={confirmGridSizeChange}
                  className="flex-1 py-3 rounded-2xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
