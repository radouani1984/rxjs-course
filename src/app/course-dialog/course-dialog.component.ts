import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { fromEvent, Observable } from "rxjs";
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild("saveButton", { static: true }) saveButton: ElementRef;

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    // this.form.valueChanges
    //   .pipe(
    //     filter(() => this.form.valid),
    //     concatMap(this.saveCourse.bind(this))
    //   )
    //   .subscribe(console.log);
  }

  saveCourse(): Observable<Response> {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: "put",
        body: JSON.stringify(this.course),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }
  ngAfterViewInit() {
    fromEvent(this.saveButton.nativeElement, "click")
      .pipe(
        filter(() => this.form.valid),
        exhaustMap(this.saveCourse.bind(this))
      )
      .subscribe(console.log);
  }

  close() {
    this.dialogRef.close();
  }
}
