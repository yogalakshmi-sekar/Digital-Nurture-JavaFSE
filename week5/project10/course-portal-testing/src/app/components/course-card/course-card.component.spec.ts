import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CourseCardComponent } from './course-card.component';
import { Course } from '../../models/course.model';
import { enrollInCourse, unenrollFromCourse } from '../../store/enrollment/enrollment.actions';

// Task 101: TestBed setup. CourseCardComponent is STANDALONE, so instead of
// `declarations: [CourseCardComponent]` (the NgModule-era pattern from the
// exercise book), standalone components go straight into `imports`.
// CourseCardComponent injects NgRx's Store (Hands-On 9), so we supply
// `provideMockStore` — a lightweight in-memory store that lets us set
// state directly and spy on dispatch, without running real reducers/effects.
describe('CourseCardComponent', () => {
  let component: CourseCardComponent;
  let fixture: ComponentFixture<CourseCardComponent>;
  let store: MockStore;

  const mockCourse: Course = {
    id: 1,
    name: 'Data Structures',
    code: 'CS101',
    credits: 4,
    gradeStatus: 'passed'
  };

  const initialState = {
    course: { courses: [], loading: false, error: null },
    enrollment: { enrolledCourseIds: [] as number[] }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCardComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  // Task 102: the baseline "does it even instantiate" test — cheap, but
  // catches DI wiring mistakes (e.g. a missing provider) immediately.
  it('should create', () => {
    component.course = mockCourse;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // Task 103: @Input rendering — set the input directly on the component
  // instance (bypassing any parent template), call detectChanges() to run
  // change detection, then query the RENDERED DOM to assert what the user
  // would actually see.
  it('should render the course name from the @Input', () => {
    component.course = mockCourse;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h4'));
    expect(heading.nativeElement.textContent).toContain('Data Structures');
  });

  // Task 104 (adapted): the exercise book's example assumes a component
  // with an `enrollRequested` @Output that emits an id. Our
  // CourseCardComponent (evolved in Hands-On 9) instead DISPATCHES an NgRx
  // action when Enroll is clicked — the store-based equivalent of emitting
  // an event. The testing PATTERN is identical: spy on the thing that
  // should be called, trigger the DOM interaction, assert the spy.
  it('should dispatch enrollInCourse when the Enroll button is clicked and the course is not yet enrolled', () => {
    component.course = mockCourse;
    fixture.detectChanges(); // isEnrolled$ resolves to false from initialState

    spyOn(store, 'dispatch');

    const button = fixture.debugElement.query(By.css('.enroll-btn'));
    button.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(enrollInCourse({ courseId: mockCourse.id }));
  });

  it('should dispatch unenrollFromCourse when the course IS already enrolled', () => {
    store.setState({
      course: { courses: [], loading: false, error: null },
      enrollment: { enrolledCourseIds: [mockCourse.id] }
    });
    component.course = mockCourse;
    fixture.detectChanges();

    spyOn(store, 'dispatch');

    const button = fixture.debugElement.query(By.css('.enroll-btn'));
    button.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(unenrollFromCourse({ courseId: mockCourse.id }));
  });

  // A genuine @Output test, matching Task 104's ORIGINAL intent exactly —
  // CourseCardComponent DOES still have a real @Output (`cardClicked`),
  // used for navigation rather than enrollment.
  it('should emit cardClicked with the course when the card itself is clicked', () => {
    component.course = mockCourse;
    fixture.detectChanges();

    spyOn(component.cardClicked, 'emit');

    const card = fixture.debugElement.query(By.css('.card'));
    card.nativeElement.click();

    expect(component.cardClicked.emit).toHaveBeenCalledWith(mockCourse);
  });

  // Task 105: ngOnChanges — call it directly with a SimpleChanges-shaped
  // object (this is the standard way to unit test a lifecycle hook without
  // needing a parent component to actually trigger a real input change).
  it('should log via ngOnChanges when the course input changes', () => {
    spyOn(console, 'log');

    component.course = mockCourse;
    component.ngOnChanges({
      course: {
        previousValue: undefined,
        currentValue: mockCourse,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(console.log).toHaveBeenCalledWith(
      'CourseCardComponent received a new course input:',
      mockCourse
    );
  });
});
