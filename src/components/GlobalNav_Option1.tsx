import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import NavItem from "./NavItem";
import FeatureFlags from "./FeatureFlags";
import GlobalFeatureToggle from "./GlobalFeatureToggle";
import ModioLogoFeatureFlags from "./ModioLogoFeatureFlags";
import TeamsToggle from "./TeamsToggle";
import HelpCenter from "./HelpCenter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFeatureFlag, useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { supabase } from "@/lib/supabaseClient";
import { faker } from "@faker-js/faker";

interface GlobalNav_Option1Props {
  user: any;
}

const GlobalNav_Option1: React.FC<GlobalNav_Option1Props> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newFeaturesDropdownOpen, setNewFeaturesDropdownOpen] = useState(false);

  const [userAccountOpen, setUserAccountOpen] = useState(false);
  const { value: hasAllProviderTab, isLoading: navLoading } =
    useFeatureFlag("all_providers_tab");
  const { value: requireAuth } = useFeatureFlag("user_authentication");

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
        className="bg-black text-white"
        role="banner"
        aria-label="Application Header"
      >
        <div className="flex flex-1 px-4 py-3">
          <div className="flex flex-1 justify-between items-center">
            {/* Left side nav items */}
            <div className="flex items-center gap-5">
              <HelpCenter />

              {/* User Account Avatar */}
              <Popover open={userAccountOpen} onOpenChange={setUserAccountOpen}>
                <PopoverTrigger asChild>
                  <button className="flex w-7 h-7 justify-center items-center relative">
                    <div
                      className="flex w-7 h-7 px-1.5 py-1.5 justify-center items-center flex-shrink-0 rounded-full bg-[#00A7E1] transition-colors hover:opacity-80"
                      aria-label="User account"
                      data-testid="user-avatar"
                    >
                      <div
                        className="text-white text-center text-xs font-bold leading-4"
                        style={{
                          fontFamily:
                            "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        JS
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[259px] p-1 border-0 bg-white rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.10)]"
                  align="end"
                  side="bottom"
                  sideOffset={4}
                >
                  <div className="flex flex-col">
                    {/* Header */}
                    <div
                      className="flex items-center justify-end px-2 py-1 gap-2"
                      data-testid="user-account-header"
                    >
                      <div
                        className="flex-1 text-[#BABABA] text-xs font-medium tracking-[0.429px]"
                        style={{
                          fontFamily:
                            "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        Account
                      </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="flex items-center justify-end px-2 pb-2 pt-1 gap-2">
                      {/* Profile Icon */}
                      <div className="flex w-9 h-9 justify-center items-center">
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-9 h-9 flex-shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18 0C27.9249 0 36 8.07513 36 18C36 23.2691 33.7241 28.0159 30.1045 31.3095L30.1222 31.3246L29.5233 31.8247C29.4904 31.8524 29.4558 31.8778 29.4211 31.9033C29.3929 31.924 29.3647 31.9447 29.3374 31.9667C29.0631 32.1899 28.781 32.4033 28.4937 32.6101C28.4699 32.6272 28.4462 32.6444 28.4226 32.6615C28.3268 32.7308 28.2314 32.7999 28.1343 32.866C27.7979 33.0964 27.4516 33.3131 27.0995 33.5206C27.0039 33.5769 26.9084 33.6319 26.8121 33.6862C26.4253 33.9041 26.0306 34.109 25.6268 34.2988C25.5977 34.3126 25.5684 34.3257 25.5391 34.3388C25.5183 34.3481 25.4975 34.3574 25.4769 34.3669C24.1272 34.9861 22.6885 35.4423 21.185 35.712C21.1499 35.7188 21.1143 35.7251 21.079 35.7314L21.0626 35.7343C20.5933 35.8148 20.1181 35.8783 19.637 35.9221C19.6066 35.9247 19.5762 35.9268 19.5458 35.929C19.5153 35.9311 19.4849 35.9332 19.4544 35.9359C18.974 35.9745 18.4903 36 18 36C17.5052 36 17.0169 35.9745 16.5338 35.9345C16.5044 35.932 16.4751 35.9298 16.4459 35.9277C16.416 35.9256 16.3862 35.9235 16.3564 35.9208C15.8714 35.8769 15.3923 35.8115 14.9184 35.7297L14.798 35.7081C13.2716 35.4325 11.8119 34.9658 10.4446 34.3303C10.4292 34.3231 10.4137 34.3162 10.3981 34.3093C10.3826 34.3024 10.367 34.2956 10.3516 34.2884C9.93207 34.0907 9.52233 33.8753 9.12109 33.6469C9.04058 33.6011 8.96007 33.5553 8.88022 33.5081C8.51367 33.2915 8.15498 33.0631 7.80546 32.8222C7.69759 32.7477 7.59168 32.6712 7.48577 32.5947L7.48538 32.5944C7.15811 32.3581 6.83673 32.114 6.52647 31.8567C6.50827 31.8417 6.48932 31.8278 6.47034 31.8139C6.44972 31.7989 6.42907 31.7838 6.40931 31.7671L5.82545 31.2748L5.84247 31.2598C2.25425 27.9674 0 23.2423 0 18C0 8.07513 8.07513 0 18 0ZM18 1.30909C8.79644 1.30909 1.30909 8.79643 1.30909 18C1.30909 22.9235 3.45338 27.3548 6.85636 30.4128C7.02 30.2956 7.18364 30.1909 7.34858 30.1012L12.5241 27.2782C12.9934 27.0216 13.2847 26.5307 13.2847 25.9966V24.1023C12.8815 23.5695 11.7903 21.9973 11.2601 19.9204C10.7064 19.4668 10.3831 18.7946 10.3831 18.074V15.7536C10.3831 15.1861 10.5919 14.6356 10.9636 14.203V11.1482C10.9296 10.8092 10.8092 8.89134 12.1961 7.30996C13.4025 5.93345 15.355 5.23636 18 5.23636C20.645 5.23636 22.5975 5.93345 23.8039 7.31062C25.1908 8.892 25.0704 10.8085 25.0364 11.1489V14.2036C25.4088 14.6363 25.6169 15.1868 25.6169 15.7543V18.0746C25.6169 19.0073 25.0815 19.8334 24.2522 20.2274C23.8327 21.4403 23.2573 22.5674 22.5399 23.5807C22.3999 23.7777 22.2644 23.957 22.1361 24.1154V26.0509C22.1361 26.6066 22.445 27.1067 22.9425 27.3554L28.4845 30.1261C28.6828 30.2256 28.8766 30.3447 29.069 30.4776C32.5145 27.4182 34.6909 22.9595 34.6909 18C34.6909 8.79643 27.2036 1.30909 18 1.30909Z"
                            fill="#AEAEAE"
                          />
                        </svg>
                      </div>

                      {/* User Info */}
                      <div className="flex flex-col justify-center items-start flex-1">
                        <div
                          className="self-stretch text-[#545454] text-xs font-medium tracking-[0.429px]"
                          style={{
                            fontFamily:
                              "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                          }}
                        >
                          {user?.user_metadata?.full_name || "John Smith"}
                        </div>
                        <div
                          className="self-stretch text-[#BABABA] text-xs font-medium tracking-[0.429px] truncate"
                          style={{
                            fontFamily:
                              "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                          }}
                        >
                          {user?.email || "john.smith@chghealthcare.com"}
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="flex items-center justify-center py-1">
                      <div className="w-[251px] h-px bg-[#EAECEF]"></div>
                    </div>

                    {/* Logout Button */}
                    <button
                      className="flex items-center justify-end px-2 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => {
                        handleLogout();
                        setUserAccountOpen(false);
                      }}
                      data-testid="logout-button"
                    >
                      <div className="flex h-4 justify-center items-center">
                        <FontAwesomeIcon
                          icon={faSignOut}
                          className="w-4 h-4 text-[#DB0D00]"
                        />
                      </div>
                      <div
                        className="flex-1 text-[#DB0D00] text-xs font-medium tracking-[0.429px] underline"
                        style={{
                          fontFamily:
                            "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                        }}
                      >
                        Logout
                      </div>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right side - Logo */}
            <ModioLogoFeatureFlags user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Blue Navigation Bar */}
      <nav
        className="bg-[#3BA8D1] text-white"
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
    </>
  );
};

export default GlobalNav_Option1;
