import { Component, OnInit } from '@angular/core';
import { EventsService } from 'app/services/events/events.service';
import { eventsModel, imageModel, eventBaseModel } from 'app/services/events/events.model';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-addevnt',
  templateUrl: './addevnt.component.html',
  styleUrls: ['./addevnt.component.scss']
})
export class AddevntComponent implements OnInit {
  eventName = new FormControl('');
  price = new FormControl('');
  isPublic = new FormControl('');
  errorMessgae: string

  constructor(private _eventService: EventsService, private dialogRef: MatDialogRef<AddevntComponent>) { }

  eventItem: eventBaseModel;

  ngOnInit(): void {
    this.eventItem = new eventBaseModel();

  }

  addEvnt() {
    this._eventService.addBaseEvent(this.eventItem).subscribe((data) => {
      this.dialogRef.close();
      this._eventService.geteventbyUserId().subscribe((data) => {
      });
    }, (error) => {
      this.errorMessgae = error.error.message;
    });
  }

  onEventNameChange(event){
    if (this.errorMessgae !=null){
      this.errorMessgae=null;
    }

  }

}
