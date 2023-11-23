import { CoursesService } from './../services/courses.service';
import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable, catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
// import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  //public courses: Course[] = [];
  public courses$: Observable<Course[]> | null = null;


  //coursesService: CoursesService;

  constructor(
    public dialog: MatDialog,
    private _coursesService: CoursesService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,


  ) {
    // this.coursesService = new CoursesService();
    //this._coursesService.list().subscribe(courses => this.courses = courses)
    this.refresh();
  }

  ngOnInit(): void { }

  public refresh() {
    this.courses$ = this._coursesService.list().pipe(
      catchError(error => {
        this.onError('Erro ao carregar cursos.')
        return of([])
      })
    );
  }

  public onError(errorMsg: String): void {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  };

  public onAdd(): void {
    this._router.navigate(['new'], { relativeTo: this._route });
  }

  public onEdit(course: Course): void {
    this._router.navigate(['edit', course.id], { relativeTo: this._route });
  }
  public onRemove(course: Course): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this._coursesService.remove(course.id).subscribe(
          () => {
            this.refresh();
            this._snackBar.open('Curso removido com sucesso', 'X', { duration: 5000, verticalPosition: 'top', horizontalPosition: 'center' });
          },
          error => this.onError('erro ao tentar remover curso')
        );
      }
    });
  }
}