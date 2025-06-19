import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import GridPage from "./pages/GridPage";
import NotFound from "./pages/NotFound";
import {
  faUserDoctor,
  faWeight,
  faHouse,
  faAddressBook,
  faPlay,
  faFileMedical,
  faShieldAlt,
  faClipboard,
  faPills,
  faClipboardList,
  faCheckCircle,
  faCertificate,
  faHeartbeat,
  faUniversity,
  faBook,
  faBuilding,
  faHospital,
  faBriefcase,
  faUserGroup,
  faMedal,
  faGavel,
  faFolder,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Provider Info Section */}
            <Route
              index
              element={<GridPage title="Provider Info" icon={faUserDoctor} />}
            />
            <Route
              path="birth-info"
              element={<GridPage title="Birth Info" icon={faWeight} />}
            />
            <Route
              path="addresses"
              element={<GridPage title="Addresses" icon={faHouse} />}
            />
            <Route
              path="additional-names"
              element={
                <GridPage title="Additional Names" icon={faAddressBook} />
              }
            />
            <Route
              path="caqh"
              element={<GridPage title="CAQH" icon={faPlay} />}
            />
            <Route
              path="health-info"
              element={<GridPage title="Health Info" icon={faFileMedical} />}
            />

            {/* Licensure Section */}
            <Route
              path="state-licenses"
              element={<GridPage title="State Licenses" icon={faShieldAlt} />}
            />
            <Route
              path="dea-licenses"
              element={<GridPage title="DEA Licenses" icon={faClipboard} />}
            />
            <Route
              path="controlled-substance-licenses"
              element={
                <GridPage
                  title="State Controlled Substance Licenses"
                  icon={faPills}
                />
              }
            />

            {/* Actions & Exclusions Section */}
            <Route
              path="event-log"
              element={<GridPage title="Event log" icon={faClipboardList} />}
            />
            <Route
              path="oig"
              element={<GridPage title="OIG" icon={faCheckCircle} />}
            />

            {/* Certifications Section */}
            <Route
              path="board-certifications"
              element={
                <GridPage title="Board Certifications" icon={faCertificate} />
              }
            />
            <Route
              path="other-certifications"
              element={
                <GridPage title="Other Certifications" icon={faHeartbeat} />
              }
            />

            {/* Education & Training Section */}
            <Route
              path="education-training"
              element={
                <GridPage title="Education & Training" icon={faUniversity} />
              }
            />
            <Route
              path="exams"
              element={<GridPage title="Exams" icon={faBook} />}
            />

            {/* Work Experience Section */}
            <Route
              path="practice-employer"
              element={<GridPage title="Practice/Employer" icon={faBuilding} />}
            />
            <Route
              path="facility-affiliations"
              element={
                <GridPage title="Facility Affiliations" icon={faHospital} />
              }
            />
            <Route
              path="work-history"
              element={<GridPage title="Work History" icon={faBriefcase} />}
            />
            <Route
              path="peer-references"
              element={<GridPage title="Peer References" icon={faUserGroup} />}
            />
            <Route
              path="military-experience"
              element={<GridPage title="Military Experience" icon={faMedal} />}
            />

            {/* Malpractice Insurance Section */}
            <Route
              path="malpractice-insurance"
              element={
                <GridPage title="Malpractice Insurance" icon={faGavel} />
              }
            />

            {/* Documents Section */}
            <Route
              path="documents"
              element={<GridPage title="Documents" icon={faFolder} />}
            />
            <Route
              path="sent-forms"
              element={<GridPage title="Sent Forms" icon={faFileArrowUp} />}
            />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
