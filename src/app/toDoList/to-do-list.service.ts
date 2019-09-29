import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListItem } from './toDolistItem.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ToDoListService {
  private itemslist: ListItem[] = [];
  private itemsUpdated = new Subject<ListItem[]>();
  constructor(private http: HttpClient) { }

  addItem(content: string) {
    return this.http.post<{ message: string, item: ListItem }>('https://to-do-list95.herokuapp.com/api/items', { content }).subscribe(res => {
      this.itemslist.push(res.item);
      this.itemsUpdated.next([...this.itemslist]);
    });
  }

  getItems() {
    this.http.get<{ message: string, items: any }>('https://to-do-list95.herokuapp.com/api/items')
      .pipe(map(itemsData => {
        return {
          items: itemsData.items.map(item => {
            return ({
              content: item.content,
              id: item._id,
              creator: null
            })
          })
        }
      })
      ).subscribe(itemstrans => {
        this.itemslist = itemstrans.items;
        this.itemsUpdated.next([...this.itemslist]);
      });


  }
  deleteItem(item: ListItem) {
    const index = this.itemslist.indexOf(item);
    return this.http.delete('https://to-do-list95.herokuapp.com/api/items/' + item.id).subscribe(res => {
      this.itemslist.splice(index, 1);
      this.itemsUpdated.next([...this.itemslist]);

    });

  }
  getItemUpdatedListner() {
    return this.itemsUpdated.asObservable();
  }
}

