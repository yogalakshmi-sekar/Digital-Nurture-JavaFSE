import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CourseService } from './course.service';
import { Course } from '../models/course.model';

// Task 106: modern standalone equivalent of
// `imports: [HttpClientTestingModule]`. provideHttpClient() +
// provideHttpClientTesting() together give you a REAL HttpClient wired to
// a FAKE backend (HttpTestingController) — no actual network call ever
// leaves the browser/test runner.
describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  const mockCourses: Course[] = [
    { id: 1, name: 'Angular Fundamentals', code: 'ANG101', credits: 4, gradeStatus: 'passed' },
    { id: 2, name: 'Data Structures', code: 'DSA201', credits: 4, gradeStatus: 'pending' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Task 107: HttpTestingController.verify() asserts NO outstanding
  // (unflushed/unexpected) requests remain after each test — this is what
  // catches a service accidentally firing an extra HTTP call you didn't
  // expect.
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCourses() should GET from the courses endpoint and return the mocked list', () => {
    service.getCourses().subscribe((courses) => {
      expect(courses.length).toBe(2);
      expect(courses).toEqual(mockCourses);
    });

    // expectOne() asserts EXACTLY one request matches this URL was made —
    // fails the test if zero or more than one match. flush() supplies the
    // fake response body, which is what makes the subscribe() callback above
    // actually run (synchronously, in this test context).
    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  // Task 108: error handling — flush() can also simulate a failed response.
  // IMPORTANT: getCourses() pipes through retry(2), so RxJS re-subscribes
  // (meaning: fires a BRAND NEW HTTP request) up to 2 additional times
  // after the first failure — 3 requests total — before catchError finally
  // converts the error for the subscriber. The test has to satisfy all 3,
  // or httpMock.verify() in afterEach will fail with "unflushed requests".
  it('getCourses() should retry twice then surface a friendly error message on repeated server failure', () => {
    service.getCourses().subscribe({
      next: () => fail('expected an error, but got a successful response'),
      error: (err) => {
        expect(err.message).toBe('Failed to load courses. Please try again.');
      }
    });

    for (let attempt = 0; attempt < 3; attempt++) {
      const req = httpMock.expectOne('http://localhost:3000/courses');
      req.flush('Internal error', { status: 500, statusText: 'Server Error' });
    }
  });

  it('createCourse() should POST the new course', () => {
    const newCourse = { name: 'Cloud Computing', code: 'CLD501', credits: 3, gradeStatus: 'pending' as const };
    const created: Course = { id: 6, ...newCourse };

    service.createCourse(newCourse).subscribe((course) => {
      expect(course).toEqual(created);
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCourse);
    req.flush(created);
  });

  it('deleteCourse() should DELETE the given id', () => {
    service.deleteCourse(1).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/courses/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
