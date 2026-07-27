import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CourseListComponent } from './course-list.component';
import { Course } from '../../models/course.model';

// Task 109/110: testing a component that reads from the NgRx store via
// selectors, using provideMockStore instead of the real store. MockStore
// lets us hand it an initialState (or later call store.setState(...)) and
// the component's `store.select(...)` calls resolve against THAT state —
// no real reducers or effects run, and no actual HTTP calls happen either
// (loadCourses() is dispatched in ngOnInit, but MockStore.dispatch() is a
// no-op against real reducer logic by default).
describe('CourseListComponent (NgRx store integration)', () => {
  let fixture: ComponentFixture<CourseListComponent>;
  let store: MockStore;

  const mockCourses: Course[] = [
    { id: 1, name: 'Angular Fundamentals', code: 'ANG101', credits: 4, gradeStatus: 'passed' },
    { id: 2, name: 'Data Structures', code: 'DSA201', credits: 4, gradeStatus: 'pending' }
  ];

  const loadedState = {
    course: { courses: mockCourses, loading: false, error: null },
    enrollment: { enrolledCourseIds: [] as number[] }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        provideMockStore({ initialState: loadedState }),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } }
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    store = TestBed.inject(MockStore);
  });

  // Task 109: assert the rendered course cards match the initial state —
  // proves the selector -> async pipe -> *ngFor chain actually works, not
  // just that the component "creates" without error.
  it('should render one app-course-card per course in the initial store state', () => {
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('app-course-card'));
    expect(cards.length).toBe(mockCourses.length);
  });

  // Task 110: simulate a loading state AFTER the component has already
  // rendered once, then re-run change detection and assert the loading
  // indicator appears (and the course grid disappears, per the *ngIf in
  // the template).
  it('should show the loading indicator when the store reports loading: true', () => {
    fixture.detectChanges();

    store.setState({
      course: { courses: [], loading: true, error: null },
      enrollment: { enrolledCourseIds: [] }
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Loading courses...');

    const cards = fixture.debugElement.queryAll(By.css('app-course-card'));
    expect(cards.length).toBe(0);
  });

  it('should show the error message when the store reports an error', () => {
    fixture.detectChanges();

    store.setState({
      course: { courses: [], loading: false, error: 'Failed to load courses. Please try again.' },
      enrollment: { enrolledCourseIds: [] }
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Failed to load courses. Please try again.');
  });
});
