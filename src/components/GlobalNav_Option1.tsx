import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import NavItem from "./NavItem";
import FeatureFlags from "./FeatureFlags";
import GlobalFeatureToggle from "./GlobalFeatureToggle";
import ModioLogoFeatureFlags from "./ModioLogoFeatureFlags";
import TeamsToggle from "./TeamsToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFeatureFlag, useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { supabase } from "@/lib/supabaseClient";
import { faker } from '@faker-js/faker';

interface GlobalNav_Option1Props {
  user: any;
}

const GlobalNav_Option1: React.FC<GlobalNav_Option1Props> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newFeaturesDropdownOpen, setNewFeaturesDropdownOpen] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const { value: hasAllProviderTab, isLoading: navLoading } = useFeatureFlag("all_providers_tab");
  const { value: requireAuth } = useFeatureFlag("user_authentication");



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
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Black Header */}
      <header className="bg-black text-white" role="banner" aria-label="Application Header">
        <div className="flex flex-1 px-4 py-3">
          <div className="flex flex-1 justify-between items-center">
            {/* Left side nav items */}
            <div className="flex items-center gap-5">
              {/* Help Center */}
              <Popover open={helpCenterOpen} onOpenChange={setHelpCenterOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center justify-center h-5 pb-px transition-colors hover:opacity-80"
                    aria-label="Help Center"
                    data-testid="help-center-button"
                  >
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="w-5 h-5 text-white"
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[259px] p-1 border-0 bg-white rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.10)]"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <div className="flex flex-col">
                    {/* Header */}
                    <div
                      className="flex items-center justify-end px-2 py-1 gap-2"
                      data-testid="help-center-header"
                    >
                      <div
                        className="flex-1 text-[#BABABA] text-xs font-medium tracking-[0.429px]"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      >
                        Resources
                      </div>
                    </div>

                    {/* Menu Items */}
                    <button
                      className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => setHelpCenterOpen(false)}
                      data-testid="training-support-item"
                    >
                      <div
                        className="flex-1 text-[#545454] text-xs font-medium tracking-[0.429px]"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      >
                        Training & Support
                      </div>
                    </button>

                    <button
                      className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => setHelpCenterOpen(false)}
                      data-testid="modio-u-item"
                    >
                      <div
                        className="flex-1 text-[#545454] text-xs font-medium tracking-[0.429px]"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      >
                        Modio U
                      </div>
                    </button>

                    <button
                      className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => setHelpCenterOpen(false)}
                      data-testid="refer-friend-item"
                    >
                      <div
                        className="flex-1 text-[#545454] text-xs font-medium tracking-[0.429px]"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      >
                        Refer a friend
                      </div>
                    </button>

                    <button
                      className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => setHelpCenterOpen(false)}
                      data-testid="privacy-policy-item"
                    >
                      <div
                        className="flex-1 text-[#545454] text-xs font-medium tracking-[0.429px]"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      >
                        Privacy Policy
                      </div>
                    </button>

                    <button
                      className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => setHelpCenterOpen(false)}
                      data-testid="terms-conditions-item"
                    >
                      <div
                        className="flex-1 text-[#545454] text-xs font-medium tracking-[0.429px]"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      >
                        Terms & Conditions
                      </div>
                    </button>

                    <button
                      className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => {
                        window.open('https://modiohealth.com', '_blank');
                        setHelpCenterOpen(false);
                      }}
                      data-testid="modio-website-item"
                    >
                      <div
                        className="flex-1 text-[#545454] text-xs font-medium tracking-[0.429px]"
                        style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                      >
                        modiohealth.com
                      </div>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Account Avatar */}
              <div className="flex w-7 h-7 justify-center items-center relative">
                <div
                  className="flex w-7 h-7 px-1.5 py-1.5 justify-center items-center flex-shrink-0 rounded-full bg-[#00A7E1] relative"
                  role="button"
                  aria-label="User account"
                  data-testid="user-avatar"
                >
                  <div
                    className="text-white text-center text-xs font-bold leading-4"
                    style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
                  >
                    JS
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Logo */}
            <ModioLogoFeatureFlags user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Blue Navigation Bar */}
      <nav className="bg-[#3BA8D1] text-white" role="navigation" aria-label="Primary navigation">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-5 flex-1 self-stretch">
            <TeamsToggle />
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

export default GlobalNav_Option1;
