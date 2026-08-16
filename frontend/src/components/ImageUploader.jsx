import { useEffect, useState } from "react";

const ImageUploader = ({ onFilesChange, onExistingImagesChange, existingImages = [], resetTrigger }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [currentExisting, setCurrentExisting] = useState([]);

  useEffect(() => {
    if (resetTrigger) {
      setSelectedFiles([]);
      setPreviews([]);
      setCurrentExisting([]);
    }
  }, [resetTrigger]);

  useEffect(() => {
    setCurrentExisting(existingImages);
  }, [existingImages]);

  const handleChange = (event) => {
    const files = Array.from(event.target.files || []);
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);

    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    
    event.target.value = null;
  };

  const removeNewFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const removeExistingImage = (index) => {
    const updated = currentExisting.filter((_, i) => i !== index);
    setCurrentExisting(updated);
    if (onExistingImagesChange) {
      onExistingImagesChange(updated);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="w-full rounded-xl border border-dashed border-white/20 bg-slate-950/60 p-3 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-3 file:py-1.5 file:text-white hover:border-cyan-500/50 transition-colors"
      />
      {(previews.length > 0 || currentExisting.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {/* Existing Images */}
          {currentExisting.map((url, index) => (
            <div key={`existing-${index}`} className="relative group">
              <img src={url} alt={`existing ${index}`} className="h-20 w-20 rounded-lg object-cover border border-cyan-500/30" />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* New Previews */}
          {previews.map((url, index) => (
            <div key={`new-${index}`} className="relative group">
              <img src={url} alt={`preview ${index}`} className="h-20 w-20 rounded-lg object-cover border border-white/10" />
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

