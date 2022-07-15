import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { uploadImageModel } from 'app/services/events/events.model';
import { EventsService } from 'app/services/events/events.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserService } from 'app/services/user/user.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
  selector: 'app-addimage',
  templateUrl: './addimage.component.html',
  styleUrls: ['./addimage.component.scss']
})
export class AddimageComponent implements OnInit, AfterViewInit {
  note$: Observable<Event>;
  userId: number;
  isLoading: boolean=true;
  configForm: FormGroup;

  constructor(private _eventService: EventsService, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddimageComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _dialogservice:FuseConfirmationService,
  ) {

  }
  imagepath: string;
  imageItem: uploadImageModel;
  public imagedetailsValidator: FormGroup;

  get f() {
    return this.imagedetailsValidator.controls;
  }

  ngOnInit(): void {

    this._userService.userId$.subscribe(data => { 
      this.userId = data ;
      if (data)
      {
        this.isLoading=false;
      }
    })

    this.imagedetailsValidator = this._formBuilder.group({
      title: ['', [Validators.required]],
      discription: ['', [Validators.required]],
      tag: [''],
      price: ['', [Validators.required, Validators.pattern("^[0-9]*$")],],
      imageFile: ['', [Validators.required]],
      public: [true]
    });
    this.imageItem = new uploadImageModel();
    this.imageItem.eventId = this.data.eventId;

      //form for confirm dialougPopup
      this.configForm = this._formBuilder.group({
        title      : 'Error',
        message    : 'Error While Adding Iamge',
        icon       : this._formBuilder.group({
            show : true,
            name : 'heroicons_outline:exclamation',
            color: 'warn'
        }),
        actions    : this._formBuilder.group({
            confirm: this._formBuilder.group({
                show : false,
                label: 'Remove',
                color: 'warn'
            }),
            cancel : this._formBuilder.group({
                show : true,
                label: 'Cancel'
            })
        }),
        dismissible: true
    });


  }

  ngAfterViewInit(): void {
    if (!this.userId) {
      this._userService.getUserById().subscribe();
    }
  }

  uploadImage(event): void {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      console.log(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagepath = reader.result as string;
        this.imageItem.imageFile = file;
      };
    }
  }
  saveImage() {
    this.isLoading=true;
    this.imageItem.userId = this.userId;
    this.imageItem.description = this.imagedetailsValidator.get('discription').value;
    this.imageItem.price = this.imagedetailsValidator.get('price').value;
    this.imageItem.tags = this.imagedetailsValidator.get('tag').value;
    this.imageItem.title = this.imagedetailsValidator.get('title').value;
    this.imageItem.isPublic = this.imagedetailsValidator.get('public').value;
    console.log(this.imageItem);
    if (this.imagedetailsValidator.valid) {
      this._eventService.addImagetoEvent(this.imageItem).subscribe((data) => {
        this.isLoading=false;
        this.dialogRef.close();
        this._eventService.getImagesByEvent(this.data.eventId).subscribe();

      }, (error) => {
        this.configForm.controls['message'].setValue("Following error occured while saving :"+error.error.message);
        this.isLoading=false;
        const dialogRef = this._dialogservice.open(this.configForm.value);
        dialogRef.afterClosed().subscribe((result) => {
          console.log(result);
        });
        console.log(error);
      });

    }
  }
  cancel() {
    this.dialogRef.close();
  }

}
