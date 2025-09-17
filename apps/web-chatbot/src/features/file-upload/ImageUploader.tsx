import React, { useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File, preview: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageUpload(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        📷 اختر صورة
      </label>
    </div>
  );
};