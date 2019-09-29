import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToDoListService } from '../to-do-list.service';
@Component({
  selector: 'app-add-to-do-list-item',
  templateUrl: './AddToDoListItem.component.html',
  styleUrls: ['./AddToDoListItem.component.css']
})
export class AddToDoListItemComponent implements OnInit {

  constructor(public toDoListService: ToDoListService) { }

  ngOnInit() {
  }
  onItemCreate(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.toDoListService.addItem(form.value.item);
      form.reset();
    }
  }
}
