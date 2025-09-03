import React, { useEffect, useState } from 'react';
import { useAnnotations } from '../hooks/useAnnotations';
import { Annotation } from '../types/annotations';
import { Button } from './ui/button';
import { X, MessageSquare } from 'lucide-react';

interface AnnotationDisplayProps {
  isAnnotationMode: boolean;
}

export function AnnotationDisplay({ isAnnotationMode }: AnnotationDisplayProps) {
  const { annotations, removeAnnotation, currentBranch, deploymentInfo } = useAnnotations();
  const [visibleAnnotations, setVisibleAnnotations] = useState<Annotation[]>([]);

  // Filter annotations for current page and branch
  useEffect(() => {
    const currentPageAnnotations = annotations.filter(ann => {
      // Only show annotations for the current page
      const pageMatch = ann.pageUrl === window.location.pathname;
      // Only show annotations that match the current branch (or have no branch specified)
      const branchMatch = !currentBranch || !ann.gitBranch || ann.gitBranch === currentBranch;
      
      return pageMatch && branchMatch;
    });
    setVisibleAnnotations(currentPageAnnotations);
  }, [annotations, currentBranch]);

  if (!isAnnotationMode || visibleAnnotations.length === 0) {
    return null;
  }

  const getAnnotationStyle = (annotation: Annotation): React.CSSProperties => {
    try {
      const element = document.querySelector(annotation.elementSelector) as HTMLElement;
      if (!element) return { display: 'none' };

      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Base positioning
      let top = 0;
      let left = 0;
      let transform = '';
      
      switch (annotation.placement) {
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 10;
          transform = 'translateY(-50%)';
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 10;
          transform = 'translateY(-50%) translateX(-100%)';
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2;
          transform = 'translateX(-50%)';
          break;
        case 'top':
          top = rect.top - 10;
          left = rect.left + rect.width / 2;
          transform = 'translateX(-50%) translateY(-100%)';
          break;
      }
      
      // Ensure annotation stays within viewport
      const annotationWidth = 250;
      const annotationHeight = 100;
      
      if (left + annotationWidth > viewportWidth) {
        left = viewportWidth - annotationWidth - 10;
      }
      if (left < 10) {
        left = 10;
      }
      if (top + annotationHeight > viewportHeight) {
        top = viewportHeight - annotationHeight - 10;
      }
      if (top < 10) {
        top = 10;
      }

      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        transform,
        zIndex: 1000,
        maxWidth: '250px',
        backgroundColor: 'white',
        border: '2px solid #F48100',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        pointerEvents: 'auto'
      };
    } catch (error) {
      console.error('Error calculating annotation position:', error);
      return { display: 'none' };
    }
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    try {
      const element = document.querySelector(annotation.elementSelector) as HTMLElement;
      if (element) {
        // Scroll to the element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Temporarily highlight the element
        element.style.outline = '3px solid #F48100';
        element.style.outlineOffset = '2px';
        element.style.boxShadow = '0 0 0 2px rgba(244, 129, 0, 0.3)';
        
        setTimeout(() => {
          element.style.outline = '';
          element.style.outlineOffset = '';
          element.style.boxShadow = '';
        }, 3000);
      }
    } catch (error) {
      console.error('Error finding annotated element:', error);
    }
  };

  if (!isAnnotationMode || visibleAnnotations.length === 0) {
    return null;
  }

  return (
    <>
      {/* Deployment Info Display */}
      {deploymentInfo && (
        <div className="fixed top-4 right-4 z-[1001] bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 shadow-sm">
          <div className="font-medium">Deployment Info:</div>
          <div>Environment: {deploymentInfo.environment}</div>
          {deploymentInfo.branch && (
            <div>Branch: {deploymentInfo.branch}</div>
          )}
          {deploymentInfo.deploymentUrl && (
            <div>URL: {deploymentInfo.deploymentUrl}</div>
          )}
          <div className="mt-1 pt-1 border-t border-gray-200">
            <div>Total annotations: {annotations.length}</div>
            <div>Filtered annotations: {visibleAnnotations.length}</div>
          </div>
        </div>
      )}
      
      {/* Annotation Location Dots */}
      {visibleAnnotations.map((annotation) => {
        // Safety check for missing position data
        if (!annotation.position || typeof annotation.position.x !== 'number' || typeof annotation.position.y !== 'number') {
          return null;
        }
        
        return (
          <div
            key={`dot-${annotation.id}`}
            className="fixed z-[999] w-3 h-3 bg-[#F48100] rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform duration-200 shadow-[#F48100]"
            style={{
              left: `${annotation.position.x}px`,
              top: `${annotation.position.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            title={`Annotation: ${annotation.text.substring(0, 50)}${annotation.text.length > 50 ? '...' : ''}`}
            onClick={() => handleAnnotationClick(annotation)}
          />
        );
      })}
      
      {/* Annotations */}
      <div data-annotation-display="true">
      {visibleAnnotations.map((annotation) => (
        <div
          key={annotation.id}
          style={getAnnotationStyle(annotation)}
          onClick={() => handleAnnotationClick(annotation)}
          title="Click to highlight the annotated element"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="font-medium text-gray-900 mb-1">
                📝 Annotation
                {annotation.gitBranch && (
                  <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {annotation.gitBranch}
                  </span>
                )}
              </div>
              <div className="text-gray-700 text-sm leading-relaxed">
                {annotation.text}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await removeAnnotation(annotation.id);
                } catch (error) {
                  console.error('Error removing annotation:', error);
                  // You might want to show a toast notification here
                }
              }}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
