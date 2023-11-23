import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { Course } from '../model/course';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  public form: FormGroup
  public course!: Course

  constructor(
    private _formBuilder: NonNullableFormBuilder,
    private _service: CoursesService,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private _route: ActivatedRoute,
  ) {
    this.form = this._formBuilder.group({
      id: [''],
      name: ['',
        [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]],
      category: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const course: Course = this._route.snapshot.data['course'];
    this.form.setValue({
      id: course.id,
      name: course.name,
      category: course.category
    })
  }

  public onSubmit(): void {
    this._service.save(this.form.value).subscribe(result => this._onSuccess());
  }

  public onCancel(): void {
    this._location.back();
  }

  public getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);

    if(field?.hasError('required')) {
      return 'Campo obrigatorio';
    }

    if(field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength']: 5;
      return `Tamanho minimo precisa ser de ${requiredLength} caracteres.`;
    }

    if(field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength']: 200;
      return `Tamanho maximo excedido de ${requiredLength} caracteres.`;
    }
    return 'Campo invalido';
  }


  private _onSuccess(): void {
    this._snackBar.open('Curso salvo com sucesso', '', { duration: 5000 });
    this.onCancel();
  }

  private _onError(): void {
    this._snackBar.open('Erro ao salvar curso', '', { duration: 5000 });
  }

}

