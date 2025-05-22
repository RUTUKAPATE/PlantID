import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onFileRemove: () => void;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  selectedFile, 
  onFileRemove, 
  disabled = false,
  className 
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled
  });

  const handleRemoveFile = () => {
    onFileRemove();
    setPreview(null);
  };

  if (selectedFile && preview) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src={preview} 
                alt="Uploaded plant" 
                className="w-full h-80 object-cover rounded-xl shadow-md"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Image className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Ready to Identify</h4>
                  <p className="text-sm text-slate-600">{selectedFile.name}</p>
                </div>
              </div>
              <p className="text-slate-600">
                Your image looks great! Click the button below to start the identification process.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-green-600 hover:bg-slate-50 transition-all cursor-pointer",
        isDragActive && "border-green-600 bg-green-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center">
          <Upload className="text-green-600 h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload Plant Photo</h3>
          <p className="text-slate-600 mb-4">
            {isDragActive 
              ? "Drop your image here..." 
              : "Drag and drop your image here, or click to browse"
            }
          </p>
          <p className="text-sm text-slate-500">Supports JPEG, PNG, WebP up to 10MB</p>
        </div>
        <Button 
          type="button" 
          className="bg-green-600 hover:bg-green-700"
          disabled={disabled}
        >
          Choose Photo
        </Button>
      </div>
    </div>
  );
}
