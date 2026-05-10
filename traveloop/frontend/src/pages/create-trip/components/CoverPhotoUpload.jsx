import { useCallback, useRef, useState } from "react";

/**
 * CoverPhotoUpload — Drag-and-drop / click-to-browse image upload
 * with live preview and remove functionality.
 */
const CoverPhotoUpload = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      onChange(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasImage = value && previewUrl;

  const dropzoneClasses = [
    "cover-upload__dropzone",
    isDragging && "cover-upload__dropzone--active",
    hasImage && "cover-upload__dropzone--has-image",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="cover-upload">
      <label className="form-group__label">Cover Photo</label>
      <div
        className={dropzoneClasses}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        id="cover-photo-dropzone"
        aria-label="Upload cover photo"
      >
        {hasImage ? (
          <>
            <img
              src={previewUrl}
              alt="Cover preview"
              className="cover-upload__preview"
            />
            <div className="cover-upload__overlay">
              <span className="cover-upload__overlay-text">
                Click to change
              </span>
            </div>
            <button
              type="button"
              className="cover-upload__remove"
              onClick={handleRemove}
              aria-label="Remove cover photo"
              id="remove-cover-photo"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <div className="cover-upload__icon">📷</div>
            <div className="cover-upload__text">
              <p className="cover-upload__text-main">
                Drop an image or click to browse
              </p>
              <p className="cover-upload__text-sub">
                JPG, PNG, or WebP • Max 5 MB
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="cover-upload__input"
          onChange={handleInputChange}
          id="cover-photo-input"
        />
      </div>
    </div>
  );
};

export default CoverPhotoUpload;
