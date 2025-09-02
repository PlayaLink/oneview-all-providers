import React, { useEffect, useState } from 'react';
import { useAnnotations } from '../hooks/useAnnotations';
import { useAnnotationMode } from '../hooks/useAnnotationMode';
import { Annotation } from '../types/annotations';
import { Button } from './ui/button';
import { X, MessageSquare } from 'lucide-react';

export function AnnotationDisplay() {
  const { annotations, removeAnnotation } = useAnnotations();
  const { isAnnotationMode } = useAnnotationMode();
  const [visibleAnnotations, setVisibleAnnotations] = useState<Annotation[]>([]);

  // Debug logging
  console.log('🔍 AnnotationDisplay - isAnnotationMode:', isAnnotationMode);
  console.log('🔍 AnnotationDisplay - annotations count:', annotations.length);

  // Filter annotations for current page
  useEffect(() => {
    const currentPageAnnotations = annotations.filter(
      ann => ann.pageUrl === window.location.pathname
    );
    setVisibleAnnotations(currentPageAnnotations);
  }, [annotations]);

  if (!isAnnotationMode || visibleAnnotations.length === 0) {
    return null;
  }

  const handleAnnotationClick = (annotation: Annotation) => {
    // Highlight the element this annotation refers to
    try {
      const element = document.querySelector(annotation.elementSelector) as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Create a temporary highlight
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.setAttribute('data-annotation-temp-highlight', 'true');
        highlight.style.cssText = `
          position: fixed;
          top: ${rect.top}px;
          left: ${rect.left}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          background-color: rgba(255, 193, 7, 0.3);
          border: 2px solid #FFC107;
          border-radius: 4px;
          pointer-events: none;
          z-index: 9999;
          animation: pulse 2s ease-in-out;
        `;

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `;
        document.head.appendChild(style);

        document.body.appendChild(highlight);

        // Remove highlight after 3 seconds
        setTimeout(() => {
          if (highlight.parentNode) {
            highlight.parentNode.removeChild(highlight);
          }
          if (style.parentNode) {
            style.parentNode.removeChild(style);
          }
        }, 3000);
      }
    } catch (error) {
      console.warn('Could not highlight element for annotation:', annotation.elementSelector);
    }
  };

  return (
    <div 
      data-annotation-display="true"
      className="fixed top-4 left-4 z-[10001] max-w-sm"
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Annotations ({visibleAnnotations.length})
          </h3>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {visibleAnnotations.map((annotation) => (
            <div
              key={annotation.id}
              className="p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleAnnotationClick(annotation)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-700 flex-1">{annotation.text}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAnnotation(annotation.id);
                  }}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(annotation.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
