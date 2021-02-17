import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  filter,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { Lesson } from "../model/lesson";
import { fromPromise } from "rxjs/internal-compatibility";
import { debug, RxJSLoggingLevel, Utils } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.params["id"];
    this.course$ = Utils.createHttpObservable<Course>(
      `api/courses/${courseId}`
    );

    this.lessons$ = this.loadLessons();
  }
  loadLessons(searchTerm = ""): Observable<Lesson[]> {
    const courseId = this.route.snapshot.params["id"];
    return Utils.createHttpObservable<Lesson[]>(
      `api/lessons?courseId=${courseId}&filter=${searchTerm}&pageSize=100`
    ).pipe(map((response) => response["payload"]));
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent(this.input.nativeElement, "keyup").pipe(
      map((data) => data["target"]),
      map((data) => data["value"]),
      startWith(""),
      debug(RxJSLoggingLevel.INFO, "search"),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term: any) => this.loadLessons(term))
    );
  }
}
