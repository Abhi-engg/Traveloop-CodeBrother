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
    <div className="min-h-screen bg-[var(--cream)] pb-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-[var(--coral)] via-[var(--coral-soft)] to-[var(--coral-sun)] opacity-15" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--indigo)] text-white">
            TL
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              traveloop
            </p>
            <p className="text-lg font-semibold text-[var(--indigo)]">
              Dream it. Plan it. Live it.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button className="rounded-full border border-[var(--border)] px-4 py-2">
            New trip
          </button>
          <button className="rounded-full bg-[var(--indigo)] px-4 py-2 text-white">
            Share
          </button>
        </div>
      </header>
      <div className="relative mx-auto max-w-6xl px-6 pb-12">
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
