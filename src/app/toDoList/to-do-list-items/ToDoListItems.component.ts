import { Component, OnInit } from '@angular/core';
import { ListItem } from '../toDolistItem.model';
import { Subscription } from 'rxjs';
import { ToDoListService } from '../to-do-list.service';
import { AuthService } from '../../Auth/auth.service';
@Component({
  selector: 'app-to-do-list-items',
  templateUrl: './ToDoListItems.component.html',
  styleUrls: ['./ToDoListItems.component.css']
})
export class ToDoListItemsComponent implements OnInit {
  private authListenerSubs: Subscription;
  userIsAuth = false;
  itemList: ListItem[] = [];
  private itemSub: Subscription;
  constructor(public toDoListService: ToDoListService, private authService: AuthService) { }
  ngOnInit() {
    this.toDoListService.getItems();
    this.itemSub = this.toDoListService.getItemUpdatedListner().subscribe(items => {
      this.itemList = items;
      console.log(this.itemList);
    });
    this.userIsAuth = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userIsAuth = isAuth;
    });
  }
  deleteItem(item:ListItem){
    this.toDoListService.deleteItem(item);
  }
}
