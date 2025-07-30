export interface GetAchievementResponse {
  title: string;
  description: string;
  color: string;
  unlocked: boolean;
  unlockedDate: string | null;
}
