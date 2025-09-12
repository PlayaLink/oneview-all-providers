import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";


import NavItem from "./NavItem";
import FeatureFlags from "./FeatureFlags";
import GlobalFeatureToggle from "./GlobalFeatureToggle";
import ModioLogo from "./ModioLogo";
import TeamsToggle from "./TeamsToggle";
import HelpCenter from "./HelpCenter";
import UserAccount from "./UserAccount";
import FeatureFlagsMenu from "./FeatureFlagsMenu";

import { useFeatureFlag, useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { supabase } from "@/lib/supabaseClient";
import { faker } from "@faker-js/faker";

interface GlobalNav_Option1Props {
  user: any;
  isAnnotationMode?: boolean;
  setAnnotationMode?: (value: boolean) => void;
}

const GlobalNav_Option1: React.FC<GlobalNav_Option1Props> = ({ user, isAnnotationMode, setAnnotationMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newFeaturesDropdownOpen, setNewFeaturesDropdownOpen] = useState(false);
  const [showFeatureFlagsMenu, setShowFeatureFlagsMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });


  const { value: hasAllProviderTab, isLoading: navLoading } =
    useFeatureFlag("all_providers_tab");
  const { value: requireAuth } = useFeatureFlag("user_authentication");

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowFeatureFlagsMenu(true);
  };

  const handleLogout = async () => {
    // Check if the user is a dummy user (by email domain)
    if (user?.email && user.email.endsWith("@oneview.local")) {
      // Clear the dummy user from sessionStorage
      sessionStorage.removeItem("oneview_dummy_user");

      if (requireAuth) {
        // If auth is required, redirect to login
        window.location.href = "/login";
      } else {
        // If auth is not required, generate a new dummy user
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({
          firstName,
          lastName,
          provider: "oneview.local",
        });
        const dummy = {
          id: faker.string.uuid(),
          email,
          user_metadata: { full_name: `${firstName} ${lastName}` },
        };
        sessionStorage.setItem("oneview_dummy_user", JSON.stringify(dummy));
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
      <header
        className="bg-gray-900 text-white"
        role="banner"
        aria-label="Application Header"
        onContextMenu={handleContextMenu}
      >
        <div className="flex flex-1 px-4 py-3">
          <div className="flex flex-1 justify-between items-center">
            {/* Left side - Logo */}
            <ModioLogo />
             {/* Right side nav items */}
             <div className="flex items-center gap-5">
              <HelpCenter />
              <UserAccount user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Blue Navigation Bar */}
      <nav
        className="bg-blue-500 text-white"
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-5 flex-1 self-stretch">
            <TeamsToggle />
            <div
              className="flex items-center gap-2 self-stretch"
              role="menubar"
              aria-label="Main application sections"
            >
              <NavItem
                variant="global"
                role="menuitem"
                aria-current={
                  location.pathname === "/team" ? "page" : undefined
                }
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
                  aria-current={
                    location.pathname === "/all-records" ? "page" : undefined
                  }
                  active={location.pathname === "/all-records"}
                  onClick={() => navigate("/all-records")}
                  data-testid="nav-item-oneview"
                >
                  All Providers
                </NavItem>
              )}
              <NavItem variant="global" role="menuitem">
                Forms
              </NavItem>
              <NavItem variant="global" role="menuitem">
                Tracking
              </NavItem>
              <NavItem variant="global" role="menuitem">
                Logins
              </NavItem>
              <NavItem variant="global" role="menuitem">
                Tasks
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* Context Menu for Feature Flags */}
      {showFeatureFlagsMenu && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{
            left: menuPosition.x,
            top: menuPosition.y,
          }}
        >
          <FeatureFlagsMenu isAnnotationMode={isAnnotationMode} setAnnotationMode={setAnnotationMode} />
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {showFeatureFlagsMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFeatureFlagsMenu(false)}
        />
      )}
    </>
  );
};

export default GlobalNav_Option1;
