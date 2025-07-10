import React from "react";

interface ApplicationFooterProps {
  showFooter?: boolean;
}

const ApplicationFooter: React.FC<ApplicationFooterProps> = ({ showFooter = true }) => {
  if (!showFooter) {
    return null;
  }

  return (
    <footer 
      className="bg-[#545454] text-white px-20 py-4 flex items-center justify-between fixed bottom-0 left-0 right-0 z-50" 
      role="contentinfo" 
      aria-label="Application footer"
    >
      <nav className="text-[#91DCFB] text-xs font-semibold" role="navigation" aria-label="Footer navigation">
        <a href="#" className="hover:underline">Privacy Policy</a>
      </nav>
      <div className="text-xs font-semibold">
        <span className="text-white">© 2023 </span>
        <span className="text-[#91DCFB]">Modio Health</span>
        <span className="text-white"> All Rights Reserved</span>
      </div>
      <nav className="text-[#91DCFB] text-xs font-semibold" role="navigation" aria-label="Footer navigation">
        <a href="#" className="hover:underline">Terms and Conditions</a>
      </nav>

      {/* Chat Bubble */}
      <button 
        className="bg-[#12ABE4] px-5 py-3 rounded-full flex items-center gap-3 relative -top-2 -right-5 hover:bg-[#0F9BC7] transition-colors"
        aria-label="Open chat support"
        data-testid="chat-button"
      >
        <span className="text-white font-bold text-xs">Chat</span>
        <div className="w-4 h-4 bg-white rounded" aria-hidden="true"></div>
      </button>
    </footer>
  );
};

export default ApplicationFooter; 