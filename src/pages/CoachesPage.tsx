import { StaffPage } from "./StaffPage";

export function CoachesPage() {
  return (
    <StaffPage
      title="Coaches"
      subtitle="Manage coaches and trainers"
      forcedRole="COACH"
    />
  );
}