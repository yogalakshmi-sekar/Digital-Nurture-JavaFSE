// Task 59: shared Course interface — gives compile-time type checking
// everywhere this shape is used instead of falling back to 'any'.
export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  gradeStatus: 'passed' | 'failed' | 'pending';
}
