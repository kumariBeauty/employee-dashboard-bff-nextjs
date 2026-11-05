/** Shape returned to the React client for one task. */
export interface TaskDTO {
  id: number;
  employeeId: number;
  title: string;
  completed: boolean;
}
