export interface CategoryType {
  id: string;
  name: string;
  description?: string;
  slug?: string;
}

export interface TicketType {
  id: string;
  price: string | number;
  type: string;
  name?: string;
  remaining?: number;
}

export interface EventType {
  id: string;
  title: string;
  description?: string;
  date?: string;
  start_date: string;
  end_date?: string;
  location: string;
  banner_image?: string;
  image_url?: string;
  category: CategoryType;
  tickets?: TicketType[];
  isFree?: boolean;
  price?: string | number; 
  slug: string;
  featured?: boolean;
  start_time?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  location: string;
  image_url?: string;
  banner_image?: string;
  price?: number;
  isFree?: boolean;
  available_tickets: number;
  total_tickets?: number;
  organizer_id?: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  featured?: boolean;
  slug?: string;
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  role?: string;
  organization?: string;
  created_at?: string;
}
