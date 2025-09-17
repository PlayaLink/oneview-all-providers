import React from 'react';
import Icon from './ui/Icon';
import { colorTokens } from '@/lib/colorTokens';

export interface BannerProps {
  /** Icon name from the icon mapping */
  icon: string;
  /** Color theme for the banner */
  color: 'blue' | 'orange' | 'red' | 'green';
  /** Main title text */
  title: string;
  /** Description text that can contain HTML anchor tags */
  description: string;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

const Banner: React.FC<BannerProps> = ({
  icon,
  color,
  title,
  description,
  className = '',
  'data-testid': dataTestId = 'banner',
}) => {
  // Color theme mappings based on design system
  const colorThemes = {
    blue: {
      background: colorTokens.blue[50],
      iconColor: colorTokens.blue[800],
      textColor: colorTokens.blue[800],
      linkColor: colorTokens.blue[600],
    },
    orange: {
      background: colorTokens.orange[50],
      iconColor: colorTokens.orange[800],
      textColor: colorTokens.orange[800],
      linkColor: colorTokens.blue[600], // Links stay blue for consistency
    },
    red: {
      background: colorTokens.red[50],
      iconColor: colorTokens.red[800],
      textColor: colorTokens.red[800],
      linkColor: colorTokens.blue[600], // Links stay blue for consistency
    },
    green: {
      background: colorTokens.green[50],
      iconColor: colorTokens.green[800],
      textColor: colorTokens.green[800],
      linkColor: colorTokens.blue[600], // Links stay blue for consistency
    },
  };

  const theme = colorThemes[color];

  // Parse description to handle anchor tags
  const parseDescription = (desc: string) => {
    // Simple regex to find anchor tags and preserve them
    const parts = desc.split(/(<a[^>]*>.*?<\/a>)/g);
    
    return parts.map((part, index) => {
      if (part.match(/<a[^>]*>.*?<\/a>/)) {
        // This is an anchor tag, extract href and text
        const hrefMatch = part.match(/href="([^"]*)"/);
        const textMatch = part.match(/<a[^>]*>(.*?)<\/a>/);
        
        if (hrefMatch && textMatch) {
          return (
            <a
              key={index}
              href={hrefMatch[1]}
              className="underline hover:no-underline transition-all duration-200"
              style={{ color: theme.linkColor }}
              data-testid={`${dataTestId}-link-${index}`}
              aria-label={`External link: ${textMatch[1]}`}
            >
              {textMatch[1]}
            </a>
          );
        }
      }
      return part;
    });
  };

  return (
    <div
      className={`p-4 rounded-lg border-0 ${className}`}
      style={{ backgroundColor: theme.background }}
      data-testid={dataTestId}
      role="banner"
      aria-label={`${color} banner: ${title}`}
    >
        <div className="container flex flex-row gap-3 items-center">
                  {/* Icon */}
      <div
        className=""
        data-testid={`${dataTestId}-icon`}
        aria-hidden="true"
      >
        <Icon
          icon={icon}
          size="sm"
          style={{ color: theme.iconColor }}
        />
      </div>
      {/* Title */}
      <h3
          className="font-bold text-base leading-5"
          style={{ color: theme.textColor }}
          data-testid={`${dataTestId}-title`}
        >
          {title}
        </h3>

        {/* Description */}
        <div
          className="text-sm leading-5"
          style={{ color: theme.textColor }}
          data-testid={`${dataTestId}-description`}
        >
          {parseDescription(description)}
        </div>

      {/* Content */}
      <div className="flex flex-row gap-3 min-w-0">
        
      </div>
        </div>
    </div>
  );
};

export default Banner;
