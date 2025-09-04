import React, { useEffect, useState } from 'react';
import { useAnnotations } from '@/hooks/useAnnotations';
import { Annotation } from '../types/annotations';
import { Button } from './ui/button';
import Icon from '@/components/ui/Icon';

interface AnnotationDisplayProps {
  isAnnotationMode: boolean;
}

export function AnnotationDisplay({ isAnnotationMode }: AnnotationDisplayProps) {
  const { annotations, removeAnnotation, updateAnnotation, currentBranch, deploymentInfo } = useAnnotations();
  const [visibleAnnotations, setVisibleAnnotations] = useState<Annotation[]>([]);
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null);

  // Handle clicks outside annotation display to hide annotations
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const annotationDisplay = target.closest('[data-annotation-display]');
      
      // If click is outside any annotation display, hide all annotations
      if (!annotationDisplay) {
        setHoveredAnnotationId(null);
      }
    };

    // Only add listener when annotations are visible
    if (hoveredAnnotationId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [hoveredAnnotationId]);

    // Filter annotations for current page and branch
  useEffect(() => {
    const currentPageAnnotations = annotations.filter(ann => {
      // Only show annotations for the current page
      const pageMatch = ann.pageUrl === window.location.pathname;
      // Only show annotations that match the current branch (or have no branch specified)
      const branchMatch = !currentBranch || !ann.gitBranch || ann.gitBranch === currentBranch;
      
      return pageMatch && branchMatch;
    });
    
    console.log('🔍 Filtered annotations:', {
      totalAnnotations: annotations.length,
      currentPage: window.location.pathname,
      currentBranch,
      filteredCount: currentPageAnnotations.length,
      annotations: currentPageAnnotations.map(ann => ({
        id: ann.id,
        pageUrl: ann.pageUrl,
        gitBranch: ann.gitBranch,
        elementSelector: ann.elementSelector,
        placement: ann.placement,
        position: ann.position
      }))
    });
    
    setVisibleAnnotations(currentPageAnnotations);
  }, [annotations, currentBranch]);

  if (!isAnnotationMode || visibleAnnotations.length === 0) {
    return null;
  }

  const getAnnotationStyle = (annotation: Annotation): React.CSSProperties => {
    try {
      const isEditing = editingAnnotationId === annotation.id;
      
      // Use the original click position like the dots do
      const baseX = annotation.position.x;
      const baseY = annotation.position.y;
      
      // Dynamic sizing based on edit mode
      const annotationWidth = isEditing ? 350 : 250;
      const annotationHeight = isEditing ? 200 : 100;
      
      // Calculate offset based on placement
      // Since dots use transform: translate(-50%, -50%), we need to account for that
      // The dots are centered on the click position, so we position relative to the center
      let offsetX = 0;
      let offsetY = 0;
      
      switch (annotation.placement) {
        case 'right':
          offsetX = 10; // Move right from the click point
          offsetY = -15; // Center vertically
          break;
        case 'left':
          offsetX = -annotationWidth - 10; // Move left from the click point
          offsetY = -15; // Center vertically
          break;
        case 'bottom':
          offsetX = -annotationWidth / 2; // Center horizontally
          offsetY = 20; // Move down from the click point
          break;
        case 'top':
          offsetX = -annotationWidth / 2; // Center horizontally
          offsetY = -annotationHeight - 20; // Move up from the click point
          break;
        default:
          // Default to right placement if no placement is specified
          offsetX = 20;
          offsetY = -annotationHeight / 2;
          break;
      }
      
      const left = baseX + offsetX;
      const top = baseY + offsetY;
      
      // Ensure annotation stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let finalLeft = left;
      let finalTop = top;
      
      if (finalLeft + annotationWidth > viewportWidth) {
        finalLeft = viewportWidth - annotationWidth - 10;
      }
      if (finalLeft < 10) {
        finalLeft = 10;
      }
      if (finalTop + annotationHeight > viewportHeight) {
        finalTop = viewportHeight - annotationHeight - 10;
      }
      if (finalTop < 10) {
        finalTop = 10;
      }

      const finalStyle = {
        position: 'fixed' as const,
        top: `${finalTop}px`,
        left: `${finalLeft}px`,
        zIndex: 1000,
        width: isEditing ? '350px' : 'auto',
        maxWidth: isEditing ? '350px' : '250px',
        minWidth: isEditing ? '350px' : 'auto',
        backgroundColor: 'white',
        border: '2px solid #F48100',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: isEditing ? 'default' : 'pointer',
        pointerEvents: 'auto' as const
      };

      console.log('🔍 Annotation positioning:', {
        id: annotation.id,
        basePosition: { x: baseX, y: baseY },
        placement: annotation.placement,
        offset: { x: offsetX, y: offsetY },
        finalPosition: { left: finalLeft, top: finalTop },
        isEditing,
        annotationWidth,
        annotationHeight
      });

      return finalStyle;
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

  const handleEditClick = (e: React.MouseEvent, annotation: Annotation) => {
    e.stopPropagation();
    setEditingAnnotationId(annotation.id);
    setEditText(annotation.text);
  };

  const handleSaveEdit = async (annotationId: string) => {
    try {
      await updateAnnotation(annotationId, { text: editText });
      setEditingAnnotationId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating annotation:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAnnotationId(null);
    setEditText('');
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
            onClick={() => handleAnnotationClick(annotation)}
            onMouseEnter={() => setHoveredAnnotationId(annotation.id)}
          />
        );
      })}

      {/* Annotations */}
      <div data-annotation-display="true">
        {visibleAnnotations.map((annotation) => 
          hoveredAnnotationId === annotation.id ? (
            <div
              key={annotation.id}
              style={getAnnotationStyle(annotation)}
              onClick={() => handleAnnotationClick(annotation)}
              title="Click to highlight the annotated element"
              onMouseEnter={() => setHoveredAnnotationId(annotation.id)}
              onMouseLeave={() => setHoveredAnnotationId(null)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {annotation.gitBranch && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {annotation.gitBranch}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEditClick(e, annotation)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                        title="Edit annotation"
                      >
                        <Icon icon="pen-to-square" size="sm" />
                      </Button>
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
                        title="Delete annotation"
                      >
                        <Icon icon="trash" size="sm" />
                      </Button>
                    </div>
                  </div>

                  {editingAnnotationId === annotation.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                        rows={3}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.metaKey) {
                            handleSaveEdit(annotation.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <div className="flex gap-2 mt-2 flex-1 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="h-6 px-2 text-xs"
                        >
                          <Icon icon="xmark" size="sm" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(annotation.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <Icon icon="check" size="sm" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      data-annotation-text="true" 
                      className="ml-1 text-gray-700 text-sm leading-relaxed mt-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      onClick={(e) => handleEditClick(e, annotation)}
                      title="Click to edit annotation"
                    >
                      {annotation.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </>
  );
}
