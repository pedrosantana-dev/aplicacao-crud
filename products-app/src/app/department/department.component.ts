import { DepartmentService } from './../department.service';
import { Component, OnInit } from '@angular/core';
import { Department } from '../department';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  depName: string = '';
  departments: Department[] = [];
  private unsubscribe$: Subject<any> = new Subject();
  depEdit: Department | null = null;

  constructor(
    private departmentService: DepartmentService,
    private snakBar: MatSnackBar) { }

  ngOnInit(): void {
    this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deps) => this.departments = deps);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  save() {
    if (this.depEdit) {
      this.departmentService.update(
        { name: this.depName, _id: this.depEdit._id })
        .subscribe(
          (dep) => {
            this.notify('Updated!')
            this.clearFields();
          },
          (err) => {
            this.notify('Error');
            console.error(err);
          }
        )
    }
    else {
      this.departmentService.add({ name: this.depName })
        .subscribe(
          (dep) => {
            this.notify('Inserted!')
            this.clearFields();
          },
          (err) => {
            this.notify('Error');
            console.error(err);
          });
    }
  }

  clearFields() {
    this.depName = '';
    this.depEdit = null;
  }

  cancel() {
    this.clearFields();
  }
  delete(dep: Department) {
    this.departmentService.del(dep)
      .subscribe(
        () => this.notify('Removed!'),
        (err) => this.notify(err.error.message)
      )
  }
  edit(dep: Department) {
    this.depName = dep.name;
    this.depEdit = dep;
  }

  notify(msg: string) {
    this.snakBar.open(msg, "OK", { duration: 3000 });
  }

}
