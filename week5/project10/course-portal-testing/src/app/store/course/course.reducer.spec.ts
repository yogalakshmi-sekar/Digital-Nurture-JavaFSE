import { courseReducer, initialCourseState } from './course.reducer';
import * as CourseActions from './course.actions';
import { Course } from '../../models/course.model';

// Bonus test (referenced in the Hands-On 9 README's Q&A #7): reducers are
// PLAIN FUNCTIONS — (state, action) => newState — so they need NO
// Angular TestBed, NO DI, no rendering at all. Call them directly and
// assert on the returned object. This is the fastest, simplest kind of
// test in the whole NgRx stack.
describe('courseReducer', () => {
  const mockCourses: Course[] = [
    { id: 1, name: 'Angular Fundamentals', code: 'ANG101', credits: 4, gradeStatus: 'passed' }
  ];

  it('should return the initial state for an unknown action', () => {
    const action = { type: 'UNKNOWN' } as any;
    const state = courseReducer(initialCourseState, action);
    expect(state).toBe(initialCourseState);
  });

  it('should set loading to true on loadCourses', () => {
    const state = courseReducer(initialCourseState, CourseActions.loadCourses());
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should populate courses and clear loading on loadCoursesSuccess', () => {
    const loadingState = { ...initialCourseState, loading: true };
    const state = courseReducer(loadingState, CourseActions.loadCoursesSuccess({ courses: mockCourses }));

    expect(state.loading).toBeFalse();
    expect(state.courses).toEqual(mockCourses);
    // Immutability check: the reducer must return a NEW array/object, never
    // mutate the one it was given.
    expect(state).not.toBe(loadingState);
  });

  it('should set the error message and clear loading on loadCoursesFailure', () => {
    const loadingState = { ...initialCourseState, loading: true };
    const state = courseReducer(
      loadingState,
      CourseActions.loadCoursesFailure({ error: 'Failed to load courses. Please try again.' })
    );

    expect(state.loading).toBeFalse();
    expect(state.error).toBe('Failed to load courses. Please try again.');
  });

  it('should append the new course on addCourseSuccess without mutating the original array', () => {
    const stateWithOne = { ...initialCourseState, courses: mockCourses };
    const newCourse: Course = { id: 2, name: 'Cloud Computing', code: 'CLD501', credits: 3, gradeStatus: 'pending' };

    const state = courseReducer(stateWithOne, CourseActions.addCourseSuccess({ course: newCourse }));

    expect(state.courses.length).toBe(2);
    expect(state.courses).toContain(newCourse);
    expect(mockCourses.length).toBe(1); // original array untouched
  });
});
