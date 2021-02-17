import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { response } from "express";
import { concat, interval, merge, noop, Observable } from "rxjs";
import { concatAll, map } from "rxjs/operators";
import { Utils } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // const source1$ = interval(1000);
    // const source2$ = interval(2000);
    // const source$ = merge(source1$, source2$);
    // source$.subscribe(console.log);
  }
}
