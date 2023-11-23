import { FormUtilsService } from './../../shared/form/form-utils.service';
import { Course } from './../model/course';
import { Lessons } from './../model/lessons';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  public form!: FormGroup
  public course!: Course

  constructor(
    private _formBuilder: NonNullableFormBuilder,
    private _service: CoursesService,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private _route: ActivatedRoute,
    public formUtils: FormUtilsService,
  ) { }

  ngOnInit(): void {
    const course: Course = this._route.snapshot.data['course'];

    this.form = this._formBuilder.group({
      id: [course.id],
      name: [course.name,
      [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)]],
      category: [course.category, [Validators.required]],
      lessons: this._formBuilder.array(this.retrieveLessons(course), Validators.required)
    });
  }

  public onSubmit(): void {
    if(this.form.valid){
      this._service.save(this.form.value)
      .subscribe(result => this._onSuccess());
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  public onCancel(): void {
    this._location.back();
  }

  public getLessonsFormArray(){
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  public addNewLesson() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this._createLesson());
  }

  public removeLesson(index: number) {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }
  private _onSuccess(): void {
    this._snackBar.open('Curso salvo com sucesso', '', { duration: 5000 });
    this.onCancel();
  }

  private _onError(): void {
    this._snackBar.open('Erro ao salvar curso', '', { duration: 5000 });
  }

  private retrieveLessons(course: Course) {
    const lessonsA = [];
    if (course?.lessons) {
      course.lessons.forEach(lessons => lessonsA.push(this._createLesson(lessons)))
    } else {
      lessonsA.push(this._createLesson());
    }
    return lessonsA;
  }

  private _createLesson(lessons: Lessons = { id: '', name: '', youtubeUrl: '' }) {
    return this._formBuilder.group({
      id: [lessons.id],
      name: [lessons.name,
        [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]],
      youtubeUrl: [lessons.youtubeUrl,
        [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(11)]]
    })
  }
}
