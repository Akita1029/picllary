import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventByidComponent } from '../event-byid/event-byid.component';

@Component({
  selector: 'app-edit-image-details',
  templateUrl: './edit-image-details.component.html',
  styleUrls: ['./edit-image-details.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditImageDetailsComponent implements OnInit {

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fileManagerListComponent: EventByidComponent,

  ) { }

  ngOnInit(): void {
    this._fileManagerListComponent.matDrawer.open();
  }

}
