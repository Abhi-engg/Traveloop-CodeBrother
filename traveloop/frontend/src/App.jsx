import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import ActivitySearch from "./pages/ActivitySearch";
import AdminPage from "./pages/AdminPage";
import BudgetPage from "./pages/BudgetPage";
import CitySearch from "./pages/CitySearch";
import CreateTripPage from "./pages/CreateTripPage";
import DashboardPage from "./pages/DashboardPage";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ItineraryView from "./pages/ItineraryView";
import LoginPage from "./pages/LoginPage";
import MyTripsPage from "./pages/MyTripsPage";
import NotesPage from "./pages/NotesPage";
import PackingPage from "./pages/PackingPage";
import ProfilePage from "./pages/ProfilePage";
import SharedTrip from "./pages/SharedTrip";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/trips" element={<MyTripsPage />} />
            <Route path="/trips/new" element={<CreateTripPage />} />
            <Route path="/itinerary/builder" element={<ItineraryBuilder />} />
            <Route path="/itinerary/view" element={<ItineraryView />} />
            <Route path="/search/cities" element={<CitySearch />} />
            <Route path="/search/activities" element={<ActivitySearch />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/packing" element={<PackingPage />} />
            <Route path="/shared" element={<SharedTrip />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
