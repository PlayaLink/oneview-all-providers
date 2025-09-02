import React, { useEffect, useState } from 'react';
import { AnnotationForm } from './AnnotationForm';
import { Switch } from './ui/switch';

interface AnnotationOverlayProps {
  children: React.ReactNode;
  isAnnotationMode: boolean;
  toggleAnnotationMode: () => void;
}

interface AnnotationOverlayProps {
  children: React.ReactNode;
}

export function AnnotationOverlay({ children, isAnnotationMode, toggleAnnotationMode }: AnnotationOverlayProps) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Debug: Show annotation mode status
  console.log('🔍 AnnotationOverlay - isAnnotationMode:', isAnnotationMode);

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

  useEffect(() => {
    console.log('🔍 AnnotationOverlay - useEffect running, isAnnotationMode:', isAnnotationMode);
    if (!isAnnotationMode) {
      setHoveredElement(null);
      setClickedElement(null);
      setClickPosition(null);
      setShowForm(false);
      
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
      
      return;
    }

    // Add annotation mode class to body for CSS targeting
    document.body.classList.add('annotation-mode-active');

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
              !element.closest('[data-annotation-overlay]')) {
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
      
      console.log('🔍 Mouse over:', target.tagName, target.className);
      
      // Skip if hovering over annotation form, display elements, or the annotation mode pill
      if (target.closest('[data-annotation-form]') || 
          target.closest('[data-annotation-display]') ||
          target.closest('[data-annotation-mode-pill]')) {
        console.log('🔍 Skipping annotation element');
        return;
      }

      console.log('🔍 Processing mouse over for element:', target.tagName);

      // Remove previous outline
      const previousOutlined = document.querySelector('[data-annotation-outline]');
      if (previousOutlined) {
        const element = previousOutlined as HTMLElement;
        element.removeAttribute('data-annotation-outline');
        element.style.outline = '';
        element.style.boxShadow = '';
        console.log('🔍 Removed previous outline');
      }

      // Add outline to current element with more visible styling
      target.setAttribute('data-annotation-outline', 'true');
      target.style.setProperty('outline', '3px solid #F48100', 'important');
      target.style.setProperty('outline-offset', '2px', 'important');
      target.style.setProperty('box-shadow', '0 0 0 2px rgba(244, 129, 0, 0.3)', 'important');
      
      console.log('🔍 Applied outline to:', target.tagName, target.className);
      console.log('🔍 Element style after outline:', target.style.outline, target.style.boxShadow);
      
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
      
      console.log('🔍 Click detected on:', target.tagName, target.className);
      
      // Skip if clicking on annotation form, display elements, or the annotation mode pill
      if (target.closest('[data-annotation-form]') || 
          target.closest('[data-annotation-display]') ||
          target.closest('[data-annotation-mode-pill]')) {
        console.log('🔍 Click skipped - annotation element');
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      
      console.log('🔍 Setting form state - element:', target.tagName, 'position:', { x: event.clientX, y: event.clientY });
      
      // Store the clicked element and position for the annotation form
      setClickedElement(target);
      setClickPosition({ x: event.clientX, y: event.clientY });
      setShowForm(true);
      
      console.log('🔍 Form should now be visible');
    };

    if (isAnnotationMode) {
      // Disable interactive elements
      disableInteractiveElements();
      
      // Add event listeners
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
      document.addEventListener('click', handleClick, true);
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isAnnotationMode]);

  const handleFormClose = () => {
    setShowForm(false);
    setClickedElement(null);
    setClickPosition(null);
  };

  return (
    <div data-annotation-overlay="true">
      <style>
        {`
          .annotation-mode-active *:not([data-annotation-form] *):not([data-annotation-display] *):not([data-annotation-overlay] *) {
            cursor: crosshair !important;
          }
          
          .annotation-mode-active [data-annotation-disabled] {
            pointer-events: none !important;
            opacity: 0.6 !important;
          }
        `}
      </style>
      {isAnnotationMode && (
        <div 
          data-annotation-mode-pill="true"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#F48100',
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
            gap: '8px'
          }}
        >
          🧪 ANNOTATION MODE
          <Switch 
            checked={isAnnotationMode} 
            onCheckedChange={(checked) => {
              // We need to access the toggle function from the parent
              // For now, we'll use a custom event to communicate with the parent
              window.dispatchEvent(new CustomEvent('toggleAnnotationMode', { detail: { checked } }));
            }}
            className="scale-75"
          />
        </div>
      )}
      {children}
      {showForm && (
        <>
          {console.log('🔍 Rendering AnnotationForm - showForm:', showForm, 'clickedElement:', clickedElement, 'clickPosition:', clickPosition)}
          <AnnotationForm
            element={clickedElement}
            position={clickPosition}
            onClose={handleFormClose}
            isAnnotationMode={isAnnotationMode}
          />
        </>
      )}
    </div>
  );
}
