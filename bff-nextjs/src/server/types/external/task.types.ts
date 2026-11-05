/** Raw shape returned by JSONPlaceholder's `/todos` (used here as per-employee tasks). */
export interface RawTask {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
