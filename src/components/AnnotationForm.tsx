import React, { useState, useEffect } from 'react';
import { useAnnotations } from '@/hooks/useAnnotations';
import { useAnnotationMode } from '@/hooks/useAnnotationMode';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import Icon from '@/components/ui/Icon';

interface AnnotationFormProps {
  element: HTMLElement | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  isAnnotationMode: boolean;
}

export function AnnotationForm({ element, position, onClose, isAnnotationMode }: AnnotationFormProps) {
  const [text, setText] = useState('');
  const { addAnnotation } = useAnnotations();

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
      if (el.id) return `#${el.id}`;
      if (el.className) {
        const classes = el.className.split(' ').filter(c => c).join('.');
        return `${el.tagName.toLowerCase()}.${classes}`;
      }
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Add Annotation</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-6 w-6 p-0"
        >
          <Icon icon="xmark" size="sm" />
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
