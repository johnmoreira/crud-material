import { Component, EventEmitter, Input, Output,  } from '@angular/core';
import { Course } from '../model/course';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent {
  
  @Input() courses: Course[] = [];
  @Output() add = new EventEmitter(false);
  @Output() edit = new EventEmitter(false);
  @Output() remove = new EventEmitter(false);

  public readonly displayedColumns = ['name', 'category', 'actions'];
  
  constructor (){}
  
  public onAdd() {
    this.add.emit(true);
   }

   public onEdit(course: Course) {
    this.edit.emit(course);
   }

   public onDelete(course: Course) {
    this.remove.emit(course);
   }
}
