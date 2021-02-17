import { error } from "@angular/compiler/src/util";
import { Observable, Observer } from "rxjs";
import { map, tap } from "rxjs/operators";

export class Utils {
  static count: number = 0;
  static createHttpObservable<T>(url: string) {
    const getData = (observer: Observer<T>) => {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(url, { signal })
        .then((response: Response) => {
          if (!response.ok) {
            this.count++;
            if (this.count === 5) {
              observer.complete();
            }
            throw new Error(
              "Request failed with status code :" + response.status
            );
          }
          return response.json();
        })
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
      return () => controller.abort();
    };
    return new Observable<T>(getData);
  }
}

export enum RxJSLoggingLevel {
  INFO,
  ERROR,
  DEBUG,
  TRACE,
}

export const debug = (level, message) => {
  return (source: Observable<any>) => {
    return source.pipe(tap(() => console.log(message)));
  };
};
