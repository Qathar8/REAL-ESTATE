export type PropertyCategory = "Plot" | "House" | "Property";

export type Property = {
  id: string;
  name: string;
  category: PropertyCategory;
  type?: string | null;
  location?: string | null;
  price: number;
  description?: string | null;
  shortDescription?: string | null;
  images?: string[] | null;
  virtualTourUrl?: string | null;
  isFeatured?: boolean;
  created_at?: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  documents?: string[] | null;
  purchaseHistory?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type SiteVisit = {
  id: string;
  client_id: string;
  property_id: string;
  scheduled_date: string;
  status: "upcoming" | "completed" | "cancelled";
  notes?: string | null;
  created_at?: string;
  client?: Client;
  property?: Property;
};

export type VirtualTour = {
  id: string;
  property_id: string;
  title: string;
  tour_url: string;
  asset_path?: string | null;
  created_at?: string;
  property?: Property;
};

export type Receipt = {
  id: string;
  client_id: string;
  property_id: string;
  amount: number;
  receipt_url: string;
  issued_at: string;
  created_at?: string;
  client?: Client;
  property?: Property;
};

