import React from 'react';
import Banner from './Banner';

/**
 * Example usage of the Banner component
 * This demonstrates how to use the Banner component with different color themes
 * and how to include anchor tags in the description
 */
const BannerExample: React.FC = () => {
  return (
    <div className="space-y-4 p-4" data-testid="banner-example">
      {/* Blue Banner */}
      <Banner
        icon="circle-exclamation"
        color="blue"
        title="Main toast message goes here"
        description="The subtitle should only be used sparingly. Links can be added <a href='#'>here</a>, too."
        data-testid="banner-blue"
      />

      {/* Orange Banner */}
      <Banner
        icon="circle-exclamation"
        color="orange"
        title="Main toast message goes here"
        description="The subtitle should only be used sparingly. Links can be added <a href='#'>here</a>, too."
        data-testid="banner-orange"
      />

      {/* Red Banner */}
      <Banner
        icon="circle-exclamation"
        color="red"
        title="Main toast message goes here"
        description="The subtitle should only be used sparingly. Links can be added <a href='#'>here</a>, too."
        data-testid="banner-red"
      />

      {/* Green Banner */}
      <Banner
        icon="circle-exclamation"
        color="green"
        title="Main toast message goes here"
        description="The subtitle should only be used sparingly. Links can be added <a href='#'>here</a>, too."
        data-testid="banner-green"
      />
    </div>
  );
};

export default BannerExample;
