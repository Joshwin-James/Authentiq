import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Link as LinkIcon, FileImage, FileVideo, FileAudio, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaUploaderProps {
  onInvestigate: (mediaData: { type: 'file' | 'url', value: string, file?: File }) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onInvestigate }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getMediaType = (file: File | string) => {
    let typeStr = '';
    if (file instanceof File) {
      typeStr = file.type;
    } else {
      typeStr = file.split('.').pop()?.toLowerCase() || '';
      if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(typeStr)) return 'image';
      if (['mp4', 'mov', 'webm'].includes(typeStr)) return 'video';
      if (['mp3', 'wav', 'ogg'].includes(typeStr)) return 'audio';
    }
    
    if (typeStr.startsWith('image/')) return 'image';
    if (typeStr.startsWith('video/')) return 'video';
    if (typeStr.startsWith('audio/')) return 'audio';
    return 'unknown';
  };

  const handleFile = (file: File) => {
    // Block video/audio — Vercel serverless has a 4.5MB upload limit.
    // Videos must be submitted via URL (YouTube link supported).
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      setActiveTab('url');
      alert('Video & audio files are too large to upload directly.\n\nPaste a YouTube or direct video URL in the URL tab instead — we\'ll automatically extract and analyze it!');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload a JPG, PNG, WEBP, or GIF image.');
      return;
    }

    // Image size guard (4MB to stay under Vercel limit)
    if (file.size > 4 * 1024 * 1024) {
      alert('Image is too large (max 4MB). Please compress it and try again.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUrl('');
  };

  const renderPreviewIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage size={32} className="text-accent" style={{ color: 'var(--text-primary)' }} />;
      case 'video': return <FileVideo size={32} className="text-accent" style={{ color: 'var(--text-primary)' }} />;
      case 'audio': return <FileAudio size={32} className="text-accent" style={{ color: 'var(--text-primary)' }} />;
      default: return <FileText size={32} className="text-accent" style={{ color: 'var(--text-primary)' }} />;
    }
  };

  const isReady = selectedFile !== null || url.length > 5;
  const currentMediaType = selectedFile ? getMediaType(selectedFile) : (url ? getMediaType(url) : 'unknown');

  return (
    <div id="uploader" className="container" style={{ padding: '2rem 0 6rem 0' }}>
      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent' }}>
        
        <AnimatePresence mode="wait">
          {!isReady ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div className="flex gap-6 border-b" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <button 
                  className={`flex items-center gap-2 ${activeTab === 'upload' ? 'text-primary' : 'text-secondary'}`}
                  style={{ color: activeTab === 'upload' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}
                  onClick={() => setActiveTab('upload')}
                >
                  <UploadCloud size={16} /> Upload File
                </button>
                <button 
                  className={`flex items-center gap-2 ${activeTab === 'url' ? 'text-primary' : 'text-secondary'}`}
                  style={{ color: activeTab === 'url' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}
                  onClick={() => setActiveTab('url')}
                >
                  <LinkIcon size={16} /> Paste URL
                </button>
              </div>

              {activeTab === 'upload' ? (
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `1px solid ${dragActive ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    backgroundColor: dragActive ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                    transition: 'all var(--transition-normal)',
                    cursor: 'pointer'
                  }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                    style={{ display: 'none' }} 
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                  />
                  <div style={{ padding: '1rem', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent' }}>
                    <UploadCloud size={24} color={dragActive ? 'var(--text-primary)' : 'var(--text-secondary)'} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Drag and drop an image</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>or click to browse</p>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Supports JPG, PNG, WEBP, GIF — Max 4MB
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    For videos, use the <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Paste URL</span> tab (YouTube supported)
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6" style={{ padding: '2rem 0' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Paste a YouTube link, video URL, or direct image URL for investigation.</p>
                  <div style={{ position: 'relative' }}>
                    <LinkIcon size={16} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      placeholder="https://example.com/media.mp4" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        letterSpacing: '0.05em'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div className="flex justify-between items-center border-b" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Media Ready for Investigation</h3>
                <button onClick={handleClear} className="flex items-center gap-2 hover-text-manipulated transition-colors" style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  <X size={14} /> Replace
                </button>
              </div>

              <div className="flex gap-6 items-center" style={{ padding: '2rem', border: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ 
                  width: '100px', height: '100px', 
                  backgroundColor: 'transparent', 
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {currentMediaType === 'image' && previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : currentMediaType === 'video' && previewUrl ? (
                    <video src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    renderPreviewIcon(currentMediaType)
                  )}
                </div>

                <div className="flex-col gap-2 flex-1">
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, wordBreak: 'break-all', letterSpacing: '0.05em' }}>
                    {selectedFile ? selectedFile.name : url}
                  </h4>
                  <div className="flex gap-4 mt-4 text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1">
                      <span style={{ textTransform: 'uppercase', border: '1px solid var(--border-subtle)', padding: '0.25rem 0.5rem', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
                        {currentMediaType}
                      </span>
                    </div>
                    {selectedFile && (
                      <div className="flex items-center gap-1" style={{ border: '1px solid var(--border-subtle)', padding: '0.25rem 0.5rem', letterSpacing: '0.1em' }}>
                        <span>{formatBytes(selectedFile.size)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary mt-2 w-full" 
                onClick={() => onInvestigate({ type: selectedFile ? 'file' : 'url', value: selectedFile ? selectedFile.name : url, file: selectedFile || undefined })}
                style={{ width: '100%', padding: '1rem', fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '0' }}
              >
                Investigate Media
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
