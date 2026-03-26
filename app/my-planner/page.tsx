import { getAllPlants, getAllCalendarEntries, getAllCompanionsRaw } from "@/lib/supabase";
import MyPlannerClient from "./MyPlannerClient";

export const revalidate = 3600;

export default async function MyPlannerPage() {
  const [plants, calendar, companions] = await Promise.all([
    getAllPlants(),
    getAllCalendarEntries(),
    getAllCompanionsRaw(),
  ]);

  return (
    <MyPlannerClient
      allPlants={plants}
      allCalendar={calendar}
      allCompanions={companions}
    />
  );
}
