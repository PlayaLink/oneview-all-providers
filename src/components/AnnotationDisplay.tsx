import React, { useEffect, useState } from 'react';
import { useAnnotations } from '@/hooks/useAnnotations';
import { Annotation } from '../types/annotations';
import { Button } from './ui/button';
import Icon from '@/components/ui/Icon';

interface AnnotationDisplayProps {
  isAnnotationMode: boolean;
  editingAnnotationId: string | null;
  setEditingAnnotationId: React.Dispatch<React.SetStateAction<string | null>>;
  annotations: Annotation[];
  currentBranch: string | null;
  removeAnnotation: (id: string) => Promise<void>;
  updateAnnotation: (id: string, updates: Partial<Pick<Annotation, 'text'>>) => Promise<void>;
}

export function AnnotationDisplay({ 
  isAnnotationMode, 
  editingAnnotationId, 
  setEditingAnnotationId, 
  annotations, 
  currentBranch, 
  removeAnnotation, 
  updateAnnotation
}: AnnotationDisplayProps) {
  const [visibleAnnotations, setVisibleAnnotations] = useState<Annotation[]>([]);
  const [editText, setEditText] = useState<string>('');
  const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null);
  const [elementPositions, setElementPositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});

  // Debug: Log when annotations change
  // console.log('🔍 AnnotationDisplay: annotations prop changed', {
  //   count: annotations.length,
  //   isAnnotationMode,
  //   currentBranch
  // });

  // Handle clicks outside annotation display to hide annotations
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const annotationDisplay = target.closest('[data-annotation-display]');
      
      // If click is outside any annotation display, hide all annotations
      if (!annotationDisplay) {
        // Don't hide annotation if user is editing or form is dirty
        if (editingAnnotationId !== null || editText.trim() !== '') {
          return;
        }
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
  }, [hoveredAnnotationId, editingAnnotationId, editText]);

    // Filter annotations for current page and branch
  useEffect(() => {
    const currentPageAnnotations = annotations.filter(ann => {
      // Only show annotations for the current page
      const pageMatch = ann.pageUrl === window.location.pathname;
      // Only show annotations that match the current branch (or have no branch specified)
      const branchMatch = !currentBranch || !ann.gitBranch || ann.gitBranch === currentBranch;
      
      return pageMatch && branchMatch;
    });
    
    // console.log('🔍 Filtered annotations:', {
    //   totalAnnotations: annotations.length,
    //   currentPage: window.location.pathname,
    //   currentBranch,
    //   filteredCount: currentPageAnnotations.length,
    //   annotations: currentPageAnnotations.map(ann => ({
    //     id: ann.id,
    //     pageUrl: ann.pageUrl,
    //     gitBranch: ann.gitBranch,
    //     elementSelector: ann.elementSelector,
    //     placement: ann.placement,
    //     position: ann.position
    //   }))
    // });
    
    // Debug: Check if the new annotation is in the filtered results
    // const newAnnotation = currentPageAnnotations.find(ann => 
    //   ann.text === 'forms' && ann.elementSelector.includes('button.font-bold')
    // );
    // if (newAnnotation) {
    //   console.log('✅ New annotation found in filtered results:', newAnnotation);
    // } else {
    //   console.log('❌ New annotation NOT found in filtered results');
    //   console.log('All annotations:', annotations.map(ann => ({
    //     id: ann.id,
    //     text: ann.text,
    //     pageUrl: ann.pageUrl,
    //     gitBranch: ann.gitBranch
    //   })));
    // }
    
    setVisibleAnnotations(currentPageAnnotations);
  }, [annotations, currentBranch]);

  // Update element positions when window resizes or scrolls
  useEffect(() => {
    const updateElementPositions = () => {
      const newPositions: Record<string, { x: number; y: number; width: number; height: number }> = {};
      const notFoundElements: string[] = [];
      
      visibleAnnotations.forEach(annotation => {
        try {
          const element = document.querySelector(annotation.elementSelector) as HTMLElement;
          if (element && element.offsetParent !== null) { // Check if element is visible
            const rect = element.getBoundingClientRect();
            // Only update if element has valid dimensions
            if (rect.width > 0 && rect.height > 0) {
              newPositions[annotation.id] = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                width: rect.width,
                height: rect.height
              };
            } else {
              notFoundElements.push(annotation.elementSelector);
              console.warn(`Element for annotation ${annotation.id} has zero dimensions:`, annotation.elementSelector);
            }
          } else {
            notFoundElements.push(annotation.elementSelector);
            console.warn(`Could not find visible element for annotation ${annotation.id}:`, annotation.elementSelector);
          }
        } catch (error) {
          notFoundElements.push(annotation.elementSelector);
          console.warn(`Error finding element for annotation ${annotation.id}:`, error);
        }
      });
      
      if (notFoundElements.length > 0) {
        // console.log('⚠️ Elements not found for annotations:', notFoundElements);
      }
      
      setElementPositions(newPositions);
    };

    // Update positions immediately
    updateElementPositions();

    // Update positions on window resize and scroll
    window.addEventListener('resize', updateElementPositions);
    window.addEventListener('scroll', updateElementPositions, { passive: true });
    
    // Update positions when DOM changes (for dynamic content)
    const observer = new MutationObserver(updateElementPositions);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      window.removeEventListener('resize', updateElementPositions);
      window.removeEventListener('scroll', updateElementPositions);
      observer.disconnect();
    };
  }, [visibleAnnotations]);

  if (!isAnnotationMode || visibleAnnotations.length === 0) {
    return null;
  }

  const getAnnotationStyle = (annotation: Annotation): React.CSSProperties => {
    try {
      const isEditing = editingAnnotationId === annotation.id;
      
      // Get the current position of the associated element
      const elementPosition = elementPositions[annotation.id];
      
      if (!elementPosition) {
        // Fallback to original position if element not found
        console.warn(`Element not found for annotation ${annotation.id}, using fallback position`);
        return {
          position: 'fixed' as const,
          top: `${annotation.position.y}px`,
          left: `${annotation.position.x}px`,
          zIndex: 1000,
          backgroundColor: 'white',
          border: '2px solid #F48100',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: isEditing ? 'default' : 'pointer',
          pointerEvents: 'auto' as const,
          opacity: 0.7 // Make it slightly transparent to indicate fallback
        };
      }
      
      // Dynamic sizing based on edit mode
      const annotationWidth = isEditing ? 350 : 250;
      const annotationHeight = isEditing ? 200 : 100;
      
      // Calculate offset based on placement relative to element center
      let offsetX = 0;
      let offsetY = 0;
      
      switch (annotation.placement) {
        case 'right':
          offsetX = elementPosition.width / 2 + 10; // Move right from element center
          offsetY = -annotationHeight / 2; // Center vertically
          break;
        case 'left':
          offsetX = -elementPosition.width / 2 - annotationWidth - 10; // Move left from element center
          offsetY = -annotationHeight / 2; // Center vertically
          break;
        case 'bottom':
          offsetX = -annotationWidth / 2; // Center horizontally
          offsetY = elementPosition.height / 2 + 10; // Move down from element center
          break;
        case 'top':
          offsetX = -annotationWidth / 2; // Center horizontally
          offsetY = -elementPosition.height / 2 - annotationHeight - 10; // Move up from element center
          break;
        default:
          // Default to right placement if no placement is specified
          offsetX = elementPosition.width / 2 + 20;
          offsetY = -annotationHeight / 2;
          break;
      }
      
      const left = elementPosition.x + offsetX;
      const top = elementPosition.y + offsetY;
      
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

      // console.log('🔍 Dynamic annotation positioning:', {
      //   id: annotation.id,
      //   elementPosition,
      //   placement: annotation.placement,
      //   offset: { x: offsetX, y: offsetY },
      //   finalPosition: { left: finalLeft, top: finalTop },
      //   isEditing,
      //   annotationWidth,
      //   annotationHeight
      // });

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

  const handleMouseLeave = () => {
    // Don't hide annotation if user is editing or form is dirty
    if (editingAnnotationId !== null || editText.trim() !== '') {
      return;
    }
    setHoveredAnnotationId(null);
  };

  if (!isAnnotationMode || visibleAnnotations.length === 0) {
    return null;
  }

  return (
    <>


      {/* Annotation Location Dots */}
      {visibleAnnotations.map((annotation) => {
        const elementPosition = elementPositions[annotation.id];
        
        // Use element position if available, otherwise fallback to original position
        const dotX = elementPosition ? elementPosition.x : annotation.position.x;
        const dotY = elementPosition ? elementPosition.y : annotation.position.y;
        
        // Safety check for missing position data
        if (typeof dotX !== 'number' || typeof dotY !== 'number') {
          return null;
        }

        return (
          <div
            key={`dot-${annotation.id}`}
            className="fixed z-[999] w-3 h-3 bg-[#F48100] rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform duration-200 shadow-[#F48100]"
            style={{
              left: `${dotX}px`,
              top: `${dotY}px`,
              transform: 'translate(-50%, -50%)',
              opacity: elementPosition ? 1 : 0.7 // Make fallback dots slightly transparent
            }}
            onClick={() => handleAnnotationClick(annotation)}
            onMouseEnter={() => setHoveredAnnotationId(annotation.id)}
            data-testid={`annotation-dot-${annotation.id}`}
            data-referenceid="annotation-dot"
            title="Click to highlight the annotated element"
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
              onMouseLeave={handleMouseLeave}
              data-testid={`annotation-display-${annotation.id}`}
              data-referenceid="annotation-display"
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
