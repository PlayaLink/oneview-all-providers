import React from 'react';

const ModioLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-9 px-3" data-testid="modio-logo">
      {/* Modio Logo */}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/045bcc3b8f1e2829d44e88fc2c2155dfab17ea83?width=229"
        alt="Modio"
        className="flex items-start gap-2"
      />
    </div>
  );
};

export default ModioLogo; 