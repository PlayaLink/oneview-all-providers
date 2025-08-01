import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import NavItem from "./NavItem";
import FeatureFlags from "./FeatureFlags";
import GlobalFeatureToggle from "./GlobalFeatureToggle";
import ModioLogoFeatureFlags from "./ModioLogoFeatureFlags";
import TeamsToggle from "./TeamsToggle";
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
          <div className="flex flex-1 justify-end">
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
