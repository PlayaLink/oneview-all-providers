import React, { useState, useEffect } from 'react';
import { Annotation } from '../types/annotations';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import Icon from '@/components/ui/Icon';

interface AnnotationFormProps {
  element: HTMLElement | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  isAnnotationMode: boolean;
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'timestamp'>) => Promise<any>;
}

export function AnnotationForm({ element, position, onClose, isAnnotationMode, addAnnotation }: AnnotationFormProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!isAnnotationMode) {
      onClose();
    }
  }, [isAnnotationMode, onClose]);

  if (!element || !position || !isAnnotationMode) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    // Generate CSS selector for the element
    const generateSelector = (el: HTMLElement): string => {
      // Try to find the most specific and stable selector
      
      // 1. First try data-testid (most stable)
      if (el.getAttribute('data-testid')) {
        return `[data-testid="${el.getAttribute('data-testid')}"]`;
      }
      
      // 2. Try data-referenceid (also stable)
      if (el.getAttribute('data-referenceid')) {
        return `[data-referenceid="${el.getAttribute('data-referenceid')}"]`;
      }
      
      // 3. Try ID (very specific)
      if (el.id) {
        return `#${el.id}`;
      }
      
      // 4. Try to build a path-based selector using data attributes
      const buildPathSelector = (element: HTMLElement): string => {
        const path: string[] = [];
        let current = element;
        
        while (current && current !== document.body) {
          let selector = current.tagName.toLowerCase();
          
          // Add data attributes if available
          const dataAttrs = Array.from(current.attributes)
            .filter(attr => attr.name.startsWith('data-') && !attr.name.startsWith('data-testid') && !attr.name.startsWith('data-referenceid'))
            .map(attr => `[${attr.name}="${attr.value}"]`);
          
          if (dataAttrs.length > 0) {
            selector += dataAttrs.join('');
          }
          
          // Add classes if available (but be selective)
          if (current.className) {
            const classNames = typeof current.className === 'string' 
              ? current.className.split(' ').filter(c => c && !c.startsWith('css-') && !c.includes('__'))
              : Array.from(current.classList).filter(c => c && !c.startsWith('css-') && !c.includes('__'));
            
            if (classNames.length > 0) {
              // Only use classes that seem stable (not generated CSS-in-JS classes)
              const stableClasses = classNames.filter(cls => cls.length > 2 && !cls.match(/^[a-f0-9]{8,}$/));
              if (stableClasses.length > 0) {
                selector += '.' + stableClasses.join('.');
              }
            }
          }
          
          path.unshift(selector);
          
          // Stop if we find a good anchor point
          if (current.getAttribute('data-testid') || current.getAttribute('data-referenceid') || current.id) {
            break;
          }
          
          current = current.parentElement as HTMLElement;
        }
        
        return path.join(' > ');
      };
      
      const pathSelector = buildPathSelector(el);
      if (pathSelector && pathSelector !== el.tagName.toLowerCase()) {
        return pathSelector;
      }
      
      // 5. Fallback to class-based selector
      if (el.className) {
        const classNames = typeof el.className === 'string' 
          ? el.className.split(' ').filter(c => c && !c.startsWith('css-') && !c.includes('__'))
          : Array.from(el.classList).filter(c => c && !c.startsWith('css-') && !c.includes('__'));
        
        if (classNames.length > 0) {
          const stableClasses = classNames.filter(cls => cls.length > 2 && !cls.match(/^[a-f0-9]{8,}$/));
          if (stableClasses.length > 0) {
            return `${el.tagName.toLowerCase()}.${stableClasses.join('.')}`;
          }
        }
      }
      
      // 6. Final fallback
      return el.tagName.toLowerCase();
    };

    // Calculate best placement for the annotation
    const calculatePlacement = (el: HTMLElement, clickPos: { x: number; y: number }): 'top' | 'bottom' | 'left' | 'right' => {
      const rect = el.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate available space in each direction
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;
      
      // Determine best placement based on available space
      // Prefer right, then left, then bottom, then top
      if (spaceRight >= 200) return 'right';
      if (spaceLeft >= 200) return 'left';
      if (spaceBelow >= 100) return 'bottom';
      return 'top';
    };

    const elementSelector = generateSelector(element);
    const pageUrl = window.location.pathname;
    const placement = calculatePlacement(element, position);

    try {
      await addAnnotation({
        text: text.trim(),
        elementSelector,
        position,
        placement,
        pageUrl,
      });

      setText('');
      onClose();
    } catch (error) {
      console.error('Error saving annotation:', error);
      // You might want to show a toast notification here
    }
  };

  const handleCancel = () => {
    setText('');
    onClose();
  };

  // Position the form near the clicked element
  const formStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${Math.min(position.y + 10, window.innerHeight - 200)}px`,
    left: `${Math.min(position.x + 10, window.innerWidth - 350)}px`,
    zIndex: 10001,
    backgroundColor: 'white',
    color: 'inherit',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    minWidth: '300px',
    maxWidth: '400px',
  };

  return (
    <div data-annotation-form="true" style={formStyle}>
      
      <form onSubmit={handleSubmit}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note..."
          className="mb-3 min-h-[80px] resize-none"
          autoFocus
        />
        
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!text.trim()}
            className="bg-orange-500 text-primary-foreground"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
