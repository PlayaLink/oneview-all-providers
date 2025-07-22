import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";
import NavItem from "./NavItem";
import FeatureFlags from "./FeatureFlags";
import GlobalFeatureToggle from "./GlobalFeatureToggle";
import { useFeatureFlag, useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { supabase } from "@/lib/supabaseClient";
import { faker } from '@faker-js/faker';

interface GlobalNavigationProps {
  user: any;
}

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [newFeaturesDropdownOpen, setNewFeaturesDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { value: hasAllProviderTab, isLoading: navLoading } = useFeatureFlag("all_providers_tab");
  const { value: requireAuth } = useFeatureFlag("user_authentication");
  const { allSettings, updateFlag, isLoading } = useFeatureFlags();

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
        window.location.reload();
      }
    } else {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Black Header */}
      <header className="bg-black text-white" role="banner" aria-label="Application Header">
        <div className="flex flex-1 px-4 py-3">
          <div className="flex flex-1 gap-8">
            {/* CompHealth Dropdown */}
            <div className="flex flex-1 items-center gap-2 px-2 rounded-lg" role="button" tabIndex={0} aria-label="CompHealth organization selector">
              <div className="flex items-center w-7 h-7 rounded-full overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58"
                  alt="CompHealth logo"
                  className="w-7 h-7 object-cover rounded-full"
                />
              </div>
              <div className="text-white font-bold text-base leading-7" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                CompHealth
              </div>
              <div className="text-white text-[10.5px] leading-normal tracking-[0.429px]" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
                (Salt Lake City, Utah)
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" aria-hidden="true" />
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  className="text-white text-center text-xs leading-normal tracking-[0.429px] hover:underline bg-transparent border-none cursor-pointer px-2 py-1 rounded hover:bg-white/10 transition-colors"
                  style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  aria-label="New Features and settings"
                  aria-haspopup="true"
                  data-testid="feature-flags-dropdown-header"
                >
                  <div className="flex items-center gap-9" data-testid="modio-logo">
                    {/* Modio Logo */}
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/045bcc3b8f1e2829d44e88fc2c2155dfab17ea83?width=229"
                      alt="Modio"
                      className="flex items-start gap-[7.436px]"
                    />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-0 border border-gray-200 bg-white shadow-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <div className="p-4 flex flex-col gap-4 border-b border-gray-200">
                  {/* User Profile */}
                  <div ref={profileRef} className="flex items-center gap-2 relative" role="button" tabIndex={0} aria-label="User profile menu">
                    <div className="flex items-center justify-center w-6 h-6 aspect-square">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-5 h-5"
                        aria-hidden="true"
                        role="user-icon"
                      />
                    </div>
                    <button
                      className="text-center font-bold text-lg leading-normal tracking-[0.429px] bg-transparent border-none cursor-pointer"
                      style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      onClick={() => setProfileDropdownOpen((open) => !open)}
                      aria-label="Toggle user profile menu"
                      aria-expanded={profileDropdownOpen}
                      aria-haspopup="true"
                      data-testid="user-profile-toggle"
                    >
                      {user?.user_metadata?.full_name || user?.full_name || user?.email || 'User'}
                    </button>

                  </div>
                  {}
                  <button
                    className="w-full text-center font-bold px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
                    onClick={handleLogout}
                    aria-label="Logout from application"
                    data-testid="logout-button"
                  >
                    Logout
                  </button>
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-3"></div>
                  {/* Feature Flags */}
                  <div className="pt-2 pb-1">
                    <h3 className="text-md font-semibold text-gray-900 mb-1">Feature Flags</h3>
                  </div>
                  {allSettings.map(setting => (
                    <div key={setting.setting_key} className="mb-4 flex items-center justify-between">
                      <label className="font-medium text-gray-700">
                        {setting.label || setting.setting_key}
                      </label>
                      <Switch
                        checked={!!setting.setting_value}
                        onCheckedChange={(checked) => updateFlag(setting.setting_key as any, checked)}
                        disabled={isLoading}
                        className={!!setting.setting_value ? "data-[state=checked]:bg-[#3BA8D1]" : ""}
                      />
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Blue Navigation Bar */}
      <nav className="bg-[#3BA8D1] text-white" role="navigation" aria-label="Primary navigation">
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

export default GlobalNavigation; 