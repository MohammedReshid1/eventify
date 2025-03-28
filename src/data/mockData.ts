// Mock categories
export const categories = [
  { id: '1', name: 'Music', slug: 'music', icon: 'music' },
  { id: '2', name: 'Technology', slug: 'technology', icon: 'cpu' },
  { id: '3', name: 'Business', slug: 'business', icon: 'briefcase' },
  { id: '4', name: 'Sports', slug: 'sports', icon: 'trophy' },
  { id: '5', name: 'Food & Drink', slug: 'food-drink', icon: 'utensils' },
  { id: '6', name: 'Arts', slug: 'arts', icon: 'palette' },
  { id: '7', name: 'Health', slug: 'health', icon: 'heart' },
  { id: '8', name: 'Education', slug: 'education', icon: 'book' },
];

// Mock user
export const currentUser = {
  id: 'user-123',
  email: 'user@example.com',
  full_name: 'John Doe',
  avatar_url: null,
  created_at: '2023-01-01T00:00:00Z',
};

// Mock admin user
export const adminUser = {
  id: 'admin-123',
  email: 'admin@eventify.com',
  full_name: 'Admin User',
  avatar_url: null,
  created_at: '2023-01-01T00:00:00Z',
  role: 'admin',
};

// Helper function to generate dates
const generateDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Mock events
export const events = [
  {
    id: '1',
    title: 'Summer Music Festival',
    slug: 'summer-music-festival',
    description: 'Join us for a weekend of amazing music performances from top artists.',
    date: generateDate(10),
    time: '15:00',
    location: 'Central Park, New York',
    organizer_id: 'user-123',
    price: 75.00,
    tickets_available: 1000,
    tickets_sold: 750,
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[0],
    created_at: '2023-07-01T00:00:00Z',
    status: 'published',
  },
  {
    id: '2',
    title: 'Tech Conference 2023',
    slug: 'tech-conference-2023',
    description: 'Learn about the latest technological advancements and network with industry professionals.',
    date: generateDate(5),
    time: '09:00',
    location: 'Convention Center, San Francisco',
    organizer_id: 'user-124',
    price: 250.00,
    tickets_available: 500,
    tickets_sold: 425,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[1],
    created_at: '2023-06-15T00:00:00Z',
    status: 'published',
  },
  {
    id: '3',
    title: 'Startup Networking Mixer',
    slug: 'startup-networking-mixer',
    description: 'Connect with entrepreneurs and investors in a casual networking environment.',
    date: generateDate(2),
    time: '18:30',
    location: 'Innovation Hub, Austin',
    organizer_id: 'user-125',
    price: 0,
    tickets_available: 100,
    tickets_sold: 85,
    image_url: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[2],
    created_at: '2023-07-10T00:00:00Z',
    status: 'published',
  },
  {
    id: '4',
    title: 'Marathon for Charity',
    slug: 'marathon-for-charity',
    description: 'Run for a cause in this charity marathon event supporting local communities.',
    date: generateDate(15),
    time: '07:00',
    location: 'Riverfront Park, Chicago',
    organizer_id: 'user-126',
    price: 35.00,
    tickets_available: 300,
    tickets_sold: 210,
    image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[3],
    created_at: '2023-06-20T00:00:00Z',
    status: 'published',
  },
  {
    id: '5',
    title: 'Food & Wine Festival',
    slug: 'food-wine-festival',
    description: 'Experience the best food and wine from around the world with tasting sessions and chef demonstrations.',
    date: generateDate(8),
    time: '14:00',
    location: 'Culinary Center, Miami',
    organizer_id: 'user-127',
    price: 95.00,
    tickets_available: 400,
    tickets_sold: 380,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[4],
    created_at: '2023-07-05T00:00:00Z',
    status: 'published',
  },
  {
    id: '6',
    title: 'Art Exhibition Opening',
    slug: 'art-exhibition-opening',
    description: 'Be the first to see new works by contemporary artists at this exclusive gallery opening.',
    date: generateDate(4),
    time: '19:00',
    location: 'Modern Art Gallery, Los Angeles',
    organizer_id: 'user-128',
    price: 25.00,
    tickets_available: 150,
    tickets_sold: 100,
    image_url: 'https://images.unsplash.com/photo-1594115827783-31204bbc4c3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[5],
    created_at: '2023-07-12T00:00:00Z',
    status: 'published',
  },
  {
    id: '7',
    title: 'Yoga in the Park',
    slug: 'yoga-in-the-park',
    description: 'Join a community yoga session in the park, suitable for all experience levels.',
    date: generateDate(1),
    time: '08:00',
    location: 'Serenity Park, Seattle',
    organizer_id: 'user-129',
    price: 10.00,
    tickets_available: 50,
    tickets_sold: 43,
    image_url: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[6],
    created_at: '2023-07-18T00:00:00Z',
    status: 'published',
  },
  {
    id: '8',
    title: 'Creative Writing Workshop',
    slug: 'creative-writing-workshop',
    description: 'Develop your creative writing skills in this interactive workshop led by published authors.',
    date: generateDate(6),
    time: '10:00',
    location: 'Public Library, Boston',
    organizer_id: 'user-130',
    price: 45.00,
    tickets_available: 25,
    tickets_sold: 20,
    image_url: 'https://images.unsplash.com/photo-1456081445452-e290a080b494?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85',
    category: categories[7],
    created_at: '2023-07-08T00:00:00Z',
    status: 'published',
  }
];

// Featured/latest events subset
export const latestEvents = events.slice(0, 4);

// Mock tickets
export const tickets = [
  {
    id: 'ticket-1',
    event_id: '1',
    user_id: 'user-123',
    purchase_date: '2023-07-05T00:00:00Z',
    quantity: 2,
    total_price: 150.00,
    status: 'confirmed',
    ticket_code: 'TKT12345678',
  },
  {
    id: 'ticket-2',
    event_id: '3',
    user_id: 'user-123',
    purchase_date: '2023-07-15T00:00:00Z',
    quantity: 1,
    total_price: 0.00,
    status: 'confirmed',
    ticket_code: 'TKT87654321',
  },
  {
    id: 'ticket-3',
    event_id: '5',
    user_id: 'user-123',
    purchase_date: '2023-07-10T00:00:00Z',
    quantity: 2,
    total_price: 190.00,
    status: 'confirmed',
    ticket_code: 'TKT23456789',
  },
];

// Mock analytics data for admin dashboard
export const analyticsData = {
  totalEvents: 8,
  totalUsers: 200,
  totalTicketsSold: 2013,
  totalRevenue: 56750.00,
  recentSales: [
    { date: '2023-07-01', revenue: 2500 },
    { date: '2023-07-02', revenue: 1800 },
    { date: '2023-07-03', revenue: 3200 },
    { date: '2023-07-04', revenue: 2100 },
    { date: '2023-07-05', revenue: 2900 },
    { date: '2023-07-06', revenue: 3500 },
    { date: '2023-07-07', revenue: 4100 },
  ],
  popularCategories: [
    { category: 'Music', count: 45 },
    { category: 'Technology', count: 30 },
    { category: 'Business', count: 25 },
    { category: 'Sports', count: 20 },
    { category: 'Food & Drink', count: 18 },
  ],
  upcomingEvents: events.slice(0, 3)
}; 