import React, { useEffect, useState } from 'react';
import { useAnnotations } from '@/hooks/useAnnotations';
import { AnnotationForm } from './AnnotationForm';
import { AnnotationDisplay } from './AnnotationDisplay';
import { Switch } from './ui/switch';
import Icon from './ui/Icon';

interface AnnotationControllerProps {
  children: React.ReactNode;
  isAnnotationMode: boolean;
  toggleAnnotationMode: () => void;
}

export function AnnotationController({ children, isAnnotationMode, toggleAnnotationMode }: AnnotationControllerProps) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  
  // Use the annotations hook at the controller level
  const { 
    annotations, 
    addAnnotation, 
    removeAnnotation, 
    updateAnnotation, 
    currentBranch, 
    deploymentInfo 
  } = useAnnotations();

  // Listen for toggle events from the switch
  useEffect(() => {
    const handleToggleEvent = (event: CustomEvent) => {
      if (event.detail.checked !== isAnnotationMode) {
        toggleAnnotationMode();
      }
    };

    window.addEventListener('toggleAnnotationMode', handleToggleEvent as EventListener);
    return () => {
      window.removeEventListener('toggleAnnotationMode', handleToggleEvent as EventListener);
    };
  }, [isAnnotationMode, toggleAnnotationMode]);

  // Handle ESC key to exit create mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isCreateMode) {
        setIsCreateMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCreateMode]);

  useEffect(() => {
    if (!isAnnotationMode) {
      setHoveredElement(null);
      setClickedElement(null);
      setClickPosition(null);
      setShowForm(false);
      setIsCreateMode(false);
      
      // Re-enable all interactive elements
      const disabledElements = document.querySelectorAll('[data-annotation-disabled]');
      disabledElements.forEach(el => {
        const element = el as HTMLElement;
        element.removeAttribute('data-annotation-disabled');
        element.removeAttribute('disabled');
        element.style.pointerEvents = '';
        element.style.opacity = '';
      });
      
      // Remove any existing outlines
      const outlinedElements = document.querySelectorAll('[data-annotation-outline]');
      outlinedElements.forEach(el => {
        const element = el as HTMLElement;
        element.removeAttribute('data-annotation-outline');
        element.style.outline = '';
      });
      
      // Remove annotation mode class from body
      document.body.classList.remove('annotation-mode-active');
      document.body.classList.remove('create-mode-active');
      
      return;
    }

    // Add annotation mode class to body for CSS targeting
    document.body.classList.add('annotation-mode-active');
    
    // Add create mode class if in create mode
    if (isCreateMode) {
      document.body.classList.add('create-mode-active');
    } else {
      document.body.classList.remove('create-mode-active');
    }

    // Only disable interactive elements and add hover handlers if in create mode
    // When editing an annotation, we only disable elements but don't add click handlers
    if (isCreateMode) {
      // Disable all interactive elements when annotation mode is active
      const disableInteractiveElements = () => {
        const interactiveSelectors = [
          'button',
          'input',
          'select',
          'textarea',
          'a',
          '[role="button"]',
          '[role="tab"]',
          '[role="menuitem"]',
          '[onclick]',
          '[data-testid]'
        ];
        
        interactiveSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const element = el as HTMLElement;
            if (!element.closest('[data-annotation-form]') && 
                !element.closest('[data-annotation-display]') &&
                !element.closest('[data-annotation-controller]')) {
              element.setAttribute('data-annotation-disabled', 'true');
              element.setAttribute('disabled', 'true');
              element.style.pointerEvents = 'none';
              element.style.opacity = '0.6';
            }
          });
        });
      };

      const handleMouseOver = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        // Skip if hovering over annotation UI elements (not the main content)
        if (target.closest('[data-annotation-form]') || 
            target.closest('[data-annotation-display]') ||
            target.closest('[data-annotation-mode-pill]') ||
            target.closest('[data-annotation-create-button]')) {
          return;
        }

        // Remove previous outline
        const previousOutlined = document.querySelector('[data-annotation-outline]');
        if (previousOutlined) {
          const element = previousOutlined as HTMLElement;
          element.removeAttribute('data-annotation-outline');
          element.style.outline = '';
          element.style.boxShadow = '';
        }

        // Add outline to current element with more visible styling
        target.setAttribute('data-annotation-outline', 'true');
        target.style.setProperty('outline', '3px solid #F48100', 'important');
        target.style.setProperty('outline-offset', '2px', 'important');
        target.style.setProperty('box-shadow', '0 0 0 2px rgba(244, 129, 0, 0.3)', 'important');
        
        setHoveredElement(target);
      };

      const handleMouseOut = () => {
        // Remove outline when mouse leaves element
        const outlined = document.querySelector('[data-annotation-outline]');
        if (outlined) {
          const element = outlined as HTMLElement;
          element.removeAttribute('data-annotation-outline');
          element.style.outline = '';
          element.style.boxShadow = '';
        }
        setHoveredElement(null);
      };

      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        // Skip if clicking on annotation UI elements (not the main content)
        if (target.closest('[data-annotation-form]') || 
            target.closest('[data-annotation-display]') ||
            target.closest('[data-annotation-mode-pill]') ||
            target.closest('[data-annotation-create-button]')) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        
        // Store the clicked element and position for the annotation form
        setClickedElement(target);
        setClickPosition({ x: event.clientX, y: event.clientY });
        setShowForm(true);
      };

      // Disable interactive elements
      disableInteractiveElements();
      
      // Add event listeners
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
      document.addEventListener('click', handleClick, true);

      return () => {
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleClick, true);
      };
    }
    
    // If editing an annotation, disable interactive elements but don't add click handlers
    if (editingAnnotationId !== null) {
      const disableInteractiveElements = () => {
        const interactiveSelectors = [
          'button',
          'input',
          'select',
          'textarea',
          'a',
          '[role="button"]',
          '[role="tab"]',
          '[role="menuitem"]',
          '[onclick]',
          '[data-testid]'
        ];
        
        interactiveSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const element = el as HTMLElement;
            if (!element.closest('[data-annotation-form]') && 
                !element.closest('[data-annotation-display]') &&
                !element.closest('[data-annotation-controller]')) {
              element.setAttribute('data-annotation-disabled', 'true');
              element.setAttribute('disabled', 'true');
              element.style.pointerEvents = 'none';
              element.style.opacity = '0.6';
            }
          });
        });
      };

      // Disable interactive elements
      disableInteractiveElements();
    } else {
      // If not in create mode and not editing, remove any existing outlines and re-enable elements
      const outlinedElements = document.querySelectorAll('[data-annotation-outline]');
      outlinedElements.forEach(el => {
        const element = el as HTMLElement;
        element.removeAttribute('data-annotation-outline');
        element.style.outline = '';
        element.style.boxShadow = '';
      });
      
      const disabledElements = document.querySelectorAll('[data-annotation-disabled]');
      disabledElements.forEach(el => {
        const element = el as HTMLElement;
        element.removeAttribute('data-annotation-disabled');
        element.removeAttribute('disabled');
        element.style.pointerEvents = '';
        element.style.opacity = '';
      });
    }
  }, [isAnnotationMode, isCreateMode, editingAnnotationId]);

  const handleFormClose = () => {
    setShowForm(false);
    setClickedElement(null);
    setClickPosition(null);
  };

  return (
    <div data-annotation-controller="true">
      <style>
        {`
          .annotation-mode-active.create-mode-active *:not([data-annotation-form] *):not([data-annotation-display] *):not([data-annotation-controller] *):not([data-annotation-mode-pill] *) {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512' fill='%23F48100'><path d='M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.3 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.5 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32z'/></svg>") 10 10, crosshair !important;
          }
          
          /* Disable all other cursor hover effects when in create mode */
          .annotation-mode-active.create-mode-active *:not([data-annotation-form] *):not([data-annotation-display] *):not([data-annotation-controller] *):not([data-annotation-mode-pill] *) {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512' fill='%23F48100'><path d='M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.3 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.5 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32z'/></svg>") 10 10, crosshair !important;
          }
          
          /* Override common hover cursor changes */
          .annotation-mode-active.create-mode-active button:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active a:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active [role="button"]:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active [role="tab"]:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active [role="menuitem"]:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active input:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active select:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active textarea:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active label:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *),
          .annotation-mode-active.create-mode-active [data-testid]:not([data-annotation-display] *):not([data-annotation-form] *):not([data-annotation-mode-pill] *) {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512' fill='%23F48100'><path d='M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.3 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.5 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32z'/></svg>") 10 10, crosshair !important;
          }
          
          .annotation-mode-active [data-annotation-disabled] {
            pointer-events: none !important;
            opacity: 0.6 !important;
          }
          
          /* Ensure annotation mode pill always shows pointer cursor */
          .annotation-mode-active.create-mode-active [data-annotation-mode-pill] {
            cursor: pointer !important;
          }
        `}
      </style>
      <div 
        data-annotation-mode-pill="true"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          backgroundColor: '#6B7280', // Always gray regardless of state
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 10000,
          pointerEvents: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.2s ease'
        }}
      >
        <Icon icon="code" size="sm" />
        <span className="uppercase">Dev Notes</span>
        <Switch 
          checked={isAnnotationMode} 
          onCheckedChange={(checked) => {
            // We need to access the toggle function from the parent
            // For now, we'll use a custom event to communicate with the parent
            window.dispatchEvent(new CustomEvent('toggleAnnotationMode', { detail: { checked } }));
          }}
          className="scale-75 data-[state=checked]:bg-[#F48100]"
        />
      </div>
      
      {/* Create New Annotation Button */}
      {isAnnotationMode && (
        <div 
          data-annotation-create-button="true"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '200px', // Position to the right of the pill
            backgroundColor: isCreateMode ? '#6B7280' : '#F48100', // Red when in create mode, orange when not
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            zIndex: 10000,
            pointerEvents: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            border: 'none'
          }}
          onClick={() => {
            if (isCreateMode) {
              // Exit create mode
              setIsCreateMode(false);
            } else {
              // Enter create mode
              setIsCreateMode(true);
            }
          }}
          title={isCreateMode ? "Exit create mode (ESC)" : "Create new annotation"}
        >
          <Icon icon={isCreateMode ? "xmark" : "plus"} size="sm" />
        </div>
      )}
      {children}
      {showForm && (
        <>
          <AnnotationForm
            element={clickedElement}
            position={clickPosition}
            onClose={handleFormClose}
            isAnnotationMode={isAnnotationMode}
            addAnnotation={addAnnotation}
          />
        </>
      )}
      <AnnotationDisplay 
        isAnnotationMode={isAnnotationMode} 
        editingAnnotationId={editingAnnotationId}
        setEditingAnnotationId={setEditingAnnotationId}
        annotations={annotations}
        currentBranch={currentBranch}
        removeAnnotation={removeAnnotation}
        updateAnnotation={updateAnnotation}
        deploymentInfo={deploymentInfo}
      />
    </div>
  );
}
