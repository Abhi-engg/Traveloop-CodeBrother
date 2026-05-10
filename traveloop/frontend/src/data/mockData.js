// ── Trip Mock Data (India-themed) ──────────────────────────────────

export const mockTrips = [
  {
    id: 1,
    name: "Rajasthan Royal Route",
    destinations: "Jaipur → Udaipur → Jodhpur → Jaisalmer",
    startDate: "2026-06-15",
    endDate: "2026-06-28",
    coverPhoto: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1740&auto=format&fit=crop",
    budget: 45000,
    spent: 22500,
    travelers: 4,
    mood: "Heritage & Culture",
    status: "upcoming"
  },
  {
    id: 2,
    name: "Kerala Backwaters",
    destinations: "Kochi → Alleppey → Munnar → Thekkady",
    startDate: "2026-09-05",
    endDate: "2026-09-14",
    coverPhoto: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1740&auto=format&fit=crop",
    budget: 35000,
    spent: 0,
    travelers: 2,
    mood: "Nature & Wellness",
    status: "planning"
  },
  {
    id: 3,
    name: "Himalayan Escape",
    destinations: "Manali → Spiti Valley → Leh",
    startDate: "2025-10-10",
    endDate: "2025-10-22",
    coverPhoto: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1770&auto=format&fit=crop",
    budget: 60000,
    spent: 58500,
    travelers: 3,
    mood: "Adventure & Road Trip",
    status: "completed"
  }
];

export const mockStats = {
  totalTrips: 14,
  countriesVisited: 1,
  totalSaved: 8500,
};

// ── Itinerary Builder Data (Jaipur-focused) ───────────────────────

export const mockAvailableActivities = [
  { id: 'a1', name: 'Dal Baati Churma Thali', type: 'food', cost: 350, duration: '1h', rating: 4.9, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=200&auto=format&fit=crop' },
  { id: 'a2', name: 'Amer Fort Tour', type: 'sightseeing', cost: 500, duration: '3h', rating: 4.8, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=200&auto=format&fit=crop' },
  { id: 'a3', name: 'Hawa Mahal Walk', type: 'tour', cost: 200, duration: '1.5h', rating: 4.7, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=200&auto=format&fit=crop' },
  { id: 'a4', name: 'Nahargarh Fort Sunset', type: 'nature', cost: 300, duration: '2h', rating: 4.9, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=200&auto=format&fit=crop' },
  { id: 'a5', name: 'Johari Bazaar Shopping', type: 'shopping', cost: 1500, duration: '2h', rating: 4.5, image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=200&auto=format&fit=crop' },
  { id: 'a6', name: 'Chokhi Dhani Village', type: 'nightlife', cost: 1200, duration: '4h', rating: 4.8, image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?q=80&w=200&auto=format&fit=crop' },
];

export const initialItineraryColumns = {
  'day-1': {
    id: 'day-1',
    title: 'Day 1: Jaipur Arrival',
    date: 'Jun 15',
    items: [
      { id: 'i1', name: 'Check-in at Rambagh Palace', type: 'lodging', time: '14:00', cost: 8500 },
      { id: 'i2', name: 'Dal Baati Churma Thali', type: 'food', time: '16:00', cost: 350 },
    ]
  },
  'day-2': {
    id: 'day-2',
    title: 'Day 2: Pink City Heritage',
    date: 'Jun 16',
    items: [
      { id: 'i3', name: 'Amer Fort Tour', type: 'sightseeing', time: '09:00', cost: 500 },
      { id: 'i4', name: 'Hawa Mahal Walk', type: 'tour', time: '13:00', cost: 200 },
    ]
  },
  'day-3': {
    id: 'day-3',
    title: 'Day 3: Udaipur Road Trip',
    date: 'Jun 17',
    items: []
  }
};

// ── Admin Analytics Mock Data (India-based) ───────────────────────

export const adminUserGrowth = [
  { month: 'Nov', users: 420 },
  { month: 'Dec', users: 780 },
  { month: 'Jan', users: 1150 },
  { month: 'Feb', users: 1640 },
  { month: 'Mar', users: 2380 },
  { month: 'Apr', users: 3150 },
  { month: 'May', users: 4210 },
];

export const adminTopCities = [
  { name: 'Jaipur', trips: 478, growth: 22 },
  { name: 'Goa', trips: 412, growth: 18 },
  { name: 'Manali', trips: 356, growth: 31 },
  { name: 'Kerala', trips: 334, growth: 14 },
  { name: 'Varanasi', trips: 298, growth: 26 },
  { name: 'Rishikesh', trips: 267, growth: 19 },
  { name: 'Leh-Ladakh', trips: 245, growth: 42 },
  { name: 'Udaipur', trips: 221, growth: 11 },
];

export const adminTopActivities = [
  { name: 'Amer Fort Tour', city: 'Jaipur', bookings: 1240, rating: 4.9 },
  { name: 'Alleppey Houseboat', city: 'Kerala', bookings: 1085, rating: 4.8 },
  { name: 'Baga Beach Sunset', city: 'Goa', bookings: 978, rating: 4.6 },
  { name: 'Ganga Aarti', city: 'Varanasi', bookings: 892, rating: 4.9 },
  { name: 'Rohtang Pass Drive', city: 'Manali', bookings: 764, rating: 4.7 },
];

export const adminRecentUsers = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', joinDate: '2026-05-10', trips: 4, status: 'active' },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@gmail.com', joinDate: '2026-05-09', trips: 2, status: 'active' },
  { id: 3, name: 'Rohan Mehta', email: 'rohan.mehta@outlook.com', joinDate: '2026-05-08', trips: 0, status: 'idle' },
  { id: 4, name: 'Ananya Reddy', email: 'ananya.r@gmail.com', joinDate: '2026-05-07', trips: 6, status: 'active' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.singh@yahoo.com', joinDate: '2026-05-06', trips: 3, status: 'active' },
  { id: 6, name: 'Ishita Gupta', email: 'ishita.g@gmail.com', joinDate: '2026-05-05', trips: 1, status: 'active' },
  { id: 7, name: 'Arjun Nair', email: 'arjun.nair@gmail.com', joinDate: '2026-05-04', trips: 0, status: 'suspended' },
  { id: 8, name: 'Sneha Iyer', email: 'sneha.iyer@hotmail.com', joinDate: '2026-05-03', trips: 5, status: 'active' },
  { id: 9, name: 'Kabir Deshmukh', email: 'kabir.d@gmail.com', joinDate: '2026-05-02', trips: 2, status: 'active' },
  { id: 10, name: 'Diya Verma', email: 'diya.verma@gmail.com', joinDate: '2026-05-01', trips: 7, status: 'active' },
];

export const adminKPIs = {
  totalUsers: 4210,
  userGrowth: 33.6,
  activeTrips: 1680,
  tripGrowth: 18.4,
  sharedLinks: 512,
  shareGrowth: 44.2,
  avgBudget: 42000,
  budgetGrowth: 5.8,
  totalRevenue: 284000,
  revenueGrowth: 28.3,
  avgSessionMin: 9.2,
  sessionGrowth: 14.7,
};
