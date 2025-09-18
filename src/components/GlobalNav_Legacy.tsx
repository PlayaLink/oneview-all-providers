import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import NavItem from "./NavItem";
import FeatureFlags from "./FeatureFlags";
import GlobalFeatureToggle from "./GlobalFeatureToggle";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { supabase } from "@/lib/supabaseClient";
import { faker } from '@faker-js/faker';

interface GlobalNav_LegacyProps {
  user: any;
}

const GlobalNav_Legacy: React.FC<GlobalNav_LegacyProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [newFeaturesDropdownOpen, setNewFeaturesDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { value: hasAllProviderTab, isLoading: navLoading } = useFeatureFlag("all_providers_tab");
  const { value: requireAuth } = useFeatureFlag("user_authentication");

  useEffect(() => {
    if (!profileDropdownOpen) return;
    function handleClick(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileDropdownOpen]);

  const handleLogout = async () => {
    // Check if the user is a dummy user (by email domain)
    if (user?.email && user.email.endsWith('@oneview.local')) {
      // Clear the dummy user from sessionStorage
      sessionStorage.removeItem('oneview_dummy_user');
      
      if (requireAuth) {
        // If auth is required, redirect to login
        window.location.href = "/login";
      } else {
        // If auth is not required, generate a new dummy user
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName, provider: 'oneview.local' });
      const dummy = {
        id: faker.string.uuid(),
        email,
        user_metadata: { full_name: `${firstName} ${lastName}` }
      };
      sessionStorage.setItem('oneview_dummy_user', JSON.stringify(dummy));
      // Navigate to home page to trigger a fresh authentication check
      window.location.href = "/";
      }
    } else {
      await supabase.auth.signOut();
      // If auth is not required, generate a new dummy user after logout
      if (!requireAuth) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName, provider: 'oneview.local' });
        const dummy = {
          id: faker.string.uuid(),
          email,
          user_metadata: { full_name: `${firstName} ${lastName}` }
        };
        sessionStorage.setItem('oneview_dummy_user', JSON.stringify(dummy));
      }
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Black Header */}
      <header className="bg-black text-white" role="banner" aria-label="Application Header">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-9">
            {/* Modio Logo */}
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/045bcc3b8f1e2829d44e88fc2c2155dfab17ea83?width=229"
              alt="Modio"
              className="flex items-start gap-2"
            />
          </div>
          <div className="flex items-center gap-8">
            {/* Right Side Links */}
            <nav className="flex items-center gap-4" role="navigation" aria-label="Application navigation">
              {/* New Features Dropdown */}
              <FeatureFlags/>
             
              <a href="#" className="text-white text-center text-xs leading-normal tracking-wide hover:text-gray-300 font-bold" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                Modio U
              </a>
              <a href="#" className="text-white text-center text-xs leading-normal tracking-wide hover:text-gray-300 font-bold" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                Support
              </a>
            </nav>
            {/* User Profile */}
            <div ref={profileRef} className="flex items-center gap-2 relative" role="button" tabIndex={0} aria-label="User profile menu">
              <div className="flex items-center justify-center w-6 h-6 aspect-square">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C18.6166 0 24 5.38342 24 12C24 15.5127 22.4828 18.6772 20.0697 20.873L20.0815 20.8831L19.6822 21.2164C19.6603 21.235 19.6372 21.2519 19.6141 21.2689C19.5953 21.2826 19.5765 21.2964 19.5583 21.3111C19.3754 21.4599 19.1873 21.6022 18.9958 21.7401C18.9799 21.7515 18.9642 21.7629 18.9484 21.7744C18.8845 21.8206 18.8209 21.8666 18.7562 21.9107C18.5319 22.0643 18.3011 22.2087 18.0663 22.3471C18.0026 22.3846 17.9389 22.4212 17.8748 22.4575C17.6169 22.6028 17.3537 22.7393 17.0845 22.8659C17.0651 22.8751 17.0456 22.8838 17.0261 22.8925C17.0122 22.8987 16.9984 22.9049 16.9846 22.9113C16.0848 23.3241 15.1257 23.6282 14.1233 23.808C14.0998 23.8126 14.0758 23.8168 14.0522 23.821L14.0417 23.8228C13.7289 23.8765 13.4121 23.9188 13.0913 23.9481C13.071 23.9498 13.0507 23.9512 13.0304 23.9527C13.0102 23.9541 12.9899 23.9555 12.9696 23.9572C12.6493 23.983 12.3268 24 12 24C11.6701 24 11.3446 23.983 11.0225 23.9564C11.0029 23.9546 10.9834 23.9532 10.964 23.9518C10.944 23.9504 10.9242 23.949 10.9043 23.9472C10.5809 23.918 10.2615 23.8743 9.9456 23.8198L9.86531 23.8054C8.84771 23.6217 7.87462 23.3105 6.96305 22.8868C6.9528 22.882 6.94243 22.8775 6.93207 22.8729C6.92171 22.8683 6.91134 22.8637 6.90109 22.8589C6.62138 22.7271 6.34822 22.5836 6.08073 22.4313C6.02705 22.4007 5.97338 22.3702 5.92015 22.3388C5.67578 22.1943 5.43666 22.042 5.20364 21.8815C5.13164 21.8317 5.06095 21.7807 4.99025 21.7296C4.77207 21.5721 4.55782 21.4093 4.35098 21.2378C4.33885 21.2278 4.32621 21.2185 4.31355 21.2093C4.29981 21.1992 4.28605 21.1892 4.27287 21.178L3.88364 20.8499L3.89498 20.8399C1.50284 18.6449 0 15.4948 0 12C0 5.38342 5.38342 0 12 0ZM12 0.872727C5.86429 0.872727 0.872727 5.86429 0.872727 12C0.872727 15.2823 2.30225 18.2365 4.57091 20.2752C4.68 20.1971 4.78909 20.1273 4.89906 20.0675L8.34938 18.1855C8.66226 18.0144 8.85644 17.6871 8.85644 17.3311V16.0682C8.58764 15.713 7.86022 14.6649 7.50676 13.2803C7.1376 12.9779 6.92204 12.5297 6.92204 12.0493V10.5024C6.92204 10.1241 7.06124 9.75709 7.30909 9.46865V7.43215C7.2864 7.20611 7.20611 5.92756 8.13076 4.87331C8.93498 3.95564 10.2367 3.49091 12 3.49091C13.7633 3.49091 15.065 3.95564 15.8692 4.87374C16.7939 5.928 16.7136 7.20567 16.6909 7.43258V9.46909C16.9392 9.75753 17.078 10.1245 17.078 10.5028V12.0497C17.078 12.6716 16.721 13.2223 16.1681 13.4849C15.8884 14.2935 15.5049 15.0449 15.0266 15.7204C14.9332 15.8518 14.8429 15.9713 14.7574 16.0769V17.3673C14.7574 17.7377 14.9633 18.0711 15.295 18.2369L18.9897 20.0841C19.1219 20.1504 19.2511 20.2298 19.3793 20.3184C21.6764 18.2788 23.1273 15.3063 23.1273 12C23.1273 5.86429 18.1357 0.872727 12 0.872727Z" fill="white" />
                </svg>
              </div>
              <button
                className="text-white text-center text-xs font-bold leading-normal tracking-wide bg-transparent border-none cursor-pointer"
                style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                onClick={() => setProfileDropdownOpen((open) => !open)}
                aria-label="Toggle user profile menu"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                data-testid="user-profile-toggle"
              >
                {user?.user_metadata?.full_name || user?.full_name || user?.email || 'User'}
              </button>
              <div className="flex justify-center items-center w-[10px]">
                <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" aria-hidden="true" />
              </div>
              {/* Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[120px]">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                    aria-label="Logout from application"
                    data-testid="logout-button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Blue Navigation Bar */}
              <nav className="bg-blue-500 text-white" role="navigation" aria-label="Primary navigation">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-5 flex-1 self-stretch">
            <div className="flex items-center gap-2 self-stretch" role="menubar" aria-label="Main application sections">
              <NavItem
                variant="global"
                role="menuitem"
                aria-current={location.pathname === "/team" ? "page" : undefined}
                active={location.pathname === "/team"}
                onClick={() => navigate("/team")}
                data-testid="nav-item-team"
              >
                Team
              </NavItem>
              {(navLoading || hasAllProviderTab) && (
                <NavItem
                  variant="global"
                  role="menuitem"
                  aria-current={location.pathname === "/all-records" ? "page" : undefined}
                  active={location.pathname === "/all-records"}
                  onClick={() => navigate("/all-records")}
                  data-testid="nav-item-oneview"
                >
                  All Providers
                </NavItem>
              )}
              <NavItem variant="global" role="menuitem">Forms</NavItem>
              <NavItem variant="global" role="menuitem">Tracking</NavItem>
              <NavItem variant="global" role="menuitem">Logins</NavItem>
              <NavItem variant="global" role="menuitem">Tasks</NavItem>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default GlobalNav_Legacy; 