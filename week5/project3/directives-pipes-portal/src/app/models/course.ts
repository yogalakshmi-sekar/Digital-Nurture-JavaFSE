export interface Course {
  id: number;
  title: string;
  instructor: string;
  credits: number;
  enrolled: boolean;
  gradeStatus: 'passed' | 'failed' | 'pending';
}