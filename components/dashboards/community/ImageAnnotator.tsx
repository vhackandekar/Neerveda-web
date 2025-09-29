import React, { useState, useRef, MouseEvent } from 'react';
import { BoundingBox } from '../../../types';

interface ImageAnnotatorProps {
  imageUrl: string;
  onBoxChange: (box: BoundingBox | null) => void;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({ imageUrl, onBoxChange }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [box, setBox] = useState<BoundingBox | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const getRelativeCoords = (e: MouseEvent): { x: number; y: number } => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { x, y } = getRelativeCoords(e);
    setIsDrawing(true);
    setStartPos({ x, y });
    setBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const { x: currentX, y: currentY } = getRelativeCoords(e);
    
    const newX = Math.min(startPos.x, currentX);
    const newY = Math.min(startPos.y, currentY);
    const newWidth = Math.abs(currentX - startPos.x);
    const newHeight = Math.abs(currentY - startPos.y);
    
    setBox({ x: newX, y: newY, width: newWidth, height: newHeight });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (box && (box.width < 5 || box.height < 5)) {
        // If box is too small, discard it
        setBox(null);
        onBoxChange(null);
    } else {
        onBoxChange(box);
    }
  };
  
  const handleMouseLeave = () => {
    if (isDrawing) {
        handleMouseUp();
    }
  };

  return (
    <div
      className="relative w-full cursor-crosshair select-none overflow-hidden rounded-lg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Pollution report"
        className="w-full h-auto pointer-events-none"
      />
      {box && (
        <div
          className="absolute border-2 border-red-500 bg-red-500 bg-opacity-25 pointer-events-none"
          style={{
            left: `${box.x}px`,
            top: `${box.y}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
        />
      )}
    </div>
  );
};

export default ImageAnnotator;
