export interface Team {
  id: string;
  name: string;
  completionTime: number | null;
  isTimerRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
} 