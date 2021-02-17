import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { Utils } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  begginerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  constructor() {}

  ngOnInit() {
    const http$ = Utils.createHttpObservable("/api/courses");

    const courses$ = http$.pipe(
      map((courses) => Object.values(courses["payload"])),
      shareReplay(),
      retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000)))),
      catchError((err) => {
        console.log(err);
        return of([]);
      }),
      finalize(() => {
        console.log("Finalized");
      })
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((c) => c.category === "ADVANCED")
      )
    );

    this.begginerCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((c) => c.category === "BEGINNER")
      )
    );
  }
}
