import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, first, reduce, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = "http://localhost:3001/courses"

  constructor(private httpClient: HttpClient) {

  }

  public list() {
    return this.httpClient.get<Course[]>(this.API)
      .pipe(
        first(),
        //delay(5000),
        tap(courses => console.log(courses))
      );
  }

  public save(record: Partial<Course>) {
    if (record.id) {
      return this.update(record)
    }
    return this.create(record);
  }

  public getbyId(id: string) {
    return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  public remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }

/********************METHODS PRIVATE ********************/
  private create(record: Partial<Course>) {
    return this.httpClient.post<Course>(this.API, record).pipe(first());
  }

  private update(record: Partial<Course>) {
    return this.httpClient.put<Course>(`${this.API}/${record.id}`, record).pipe(first());
  }
}
