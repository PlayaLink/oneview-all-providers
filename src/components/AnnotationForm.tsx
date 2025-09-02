import React, { useState, useEffect } from 'react';
import { useAnnotations } from '../hooks/useAnnotations';
import { useAnnotationMode } from '../hooks/useAnnotationMode';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { X } from 'lucide-react';

interface AnnotationFormProps {
  element: HTMLElement | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  isAnnotationMode: boolean;
}

export function AnnotationForm({ element, position, onClose, isAnnotationMode }: AnnotationFormProps) {
  const [text, setText] = useState('');
  const { addAnnotation } = useAnnotations();

  console.log('🔍 AnnotationForm component rendered with props:', { element, position, isAnnotationMode });

  useEffect(() => {
    if (!isAnnotationMode) {
      onClose();
    }
  }, [isAnnotationMode, onClose]);

  if (!element || !position || !isAnnotationMode) {
    console.log('🔍 AnnotationForm returning null - missing props:', { element: !!element, position: !!position, isAnnotationMode });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    // Generate CSS selector for the element
    const generateSelector = (el: HTMLElement): string => {
      if (el.id) return `#${el.id}`;
      if (el.className) {
        const classes = el.className.split(' ').filter(c => c).join('.');
        return `${el.tagName.toLowerCase()}.${classes}`;
      }
      return el.tagName.toLowerCase();
    };

    const elementSelector = generateSelector(element);
    const pageUrl = window.location.pathname;

    addAnnotation({
      text: text.trim(),
      elementSelector,
      position,
      pageUrl,
    });

    setText('');
    onClose();
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

  console.log('🔍 AnnotationForm rendering with position:', position, 'style:', formStyle);

  return (
    <div data-annotation-form="true" style={formStyle}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Add Annotation</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your annotation..."
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
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
