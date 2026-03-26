export type PlantType = "vegetable" | "fruit" | "herb" | "flower" | "spice";
export type Difficulty = "easy" | "medium" | "hard";
export type Activity = "sow_indoor" | "transplant" | "sow_outdoor" | "harvest";
export type Location = "indoor" | "outdoor" | "greenhouse";
export type Relationship = "beneficial" | "neutral" | "harmful";

export interface Plant {
  id: string;
  name_en: string;
  name_fr: string | null;
  name_nl: string | null;
  name_latin: string | null;
  slug: string;
  type: PlantType;
  description: string | null;
  image_url: string | null;
  outdoor: boolean;
  greenhouse: boolean;
  difficulty: Difficulty;
  days_to_harvest: number | null;
  notes: string | null;
  variety: string | null;
  growing_tips: string | null;
}

export interface CalendarEntry {
  id: string;
  plant_id: string;
  activity: Activity;
  month_start: number;
  month_end: number;
  location: Location | null;
  notes: string | null;
}

export interface Companion {
  id: string;
  plant_id: string;
  companion_id: string;
  relationship: Relationship;
  reason: string | null;
  companion?: Plant; // joined
}

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const TYPE_LABELS: Record<PlantType, string> = {
  vegetable: "Vegetable",
  fruit: "Fruit",
  herb: "Herb",
  flower: "Flower",
  spice: "Spice",
};

export const TYPE_EMOJI: Record<PlantType, string> = {
  vegetable: "🥦",
  fruit: "🍓",
  herb: "🌿",
  flower: "🌸",
  spice: "🌶️",
};

export const ACTIVITY_LABELS: Record<Activity, string> = {
  sow_indoor: "Sow indoors",
  transplant: "Transplant",
  sow_outdoor: "Sow outdoors",
  harvest: "Harvest",
};

export const ACTIVITY_COLOURS: Record<Activity, string> = {
  sow_indoor:  "bg-blue-100 text-blue-800",
  transplant:  "bg-yellow-100 text-yellow-800",
  sow_outdoor: "bg-green-100 text-green-800",
  harvest:     "bg-orange-100 text-orange-800",
};

export const RELATIONSHIP_COLOURS: Record<Relationship, string> = {
  beneficial: "bg-green-50 border-green-300 text-green-800",
  neutral:    "bg-gray-50 border-gray-300 text-gray-700",
  harmful:    "bg-red-50 border-red-300 text-red-800",
};
