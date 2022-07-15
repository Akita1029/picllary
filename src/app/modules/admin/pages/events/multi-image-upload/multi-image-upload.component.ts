import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from 'app/services/events/events.service';
import { uploadmultiImageModel } from 'app/services/events/events.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'app/services/user/user.service';
import { empty, forkJoin, map, Observable } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import {NgxCroppedEvent, NgxPhotoEditorService} from "ngx-photo-editor";


@Component({
  selector: 'app-multi-image-upload',
  templateUrl: './multi-image-upload.component.html',
  styleUrls: ['./multi-image-upload.component.scss']
})
export class MultiImageUploadComponent implements OnInit {
  // horizontalStepperForm: FormGroup;
  stepper1Formgroup:FormGroup;
  stepper2Formgroup:FormGroup;
  userId: number;
  show_more : boolean = false;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  imageItem: uploadmultiImageModel;
  previews_show_less: File[] = [];
  previews: File[] = [];
  selectedImageFiles: string[] = [];
  failureForm: FormGroup;
  sucessForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA,SPACE];
  filteredFruits: Observable<string[]>;
  imageTags: string[] = [];
  output?: NgxCroppedEvent;
  uploading_state:boolean = true;
  defaultSelectedPrivacy;

  constructor(private _formBuilder: FormBuilder,
    private _eventService: EventsService,
    private _dialogservice:FuseConfirmationService,
    @Inject(MAT_DIALOG_DATA) public data: any
    , private _userService: UserService,
    private dialogRef: MatDialogRef<MultiImageUploadComponent>,
    private service: NgxPhotoEditorService
  ) {
    
   }

  
  ngOnInit(): void {
    this._userService.userId$.subscribe(data => {
      this.userId = data;

    })
    // Horizontal stepper form
    this.stepper1Formgroup = this._formBuilder.group({

    }),

  
    this.stepper2Formgroup= this._formBuilder.group({
      title: ['', [Validators.required]],
      discription: ['', [Validators.required]],
      tag: [''],
      price: ['', [Validators.required, Validators.pattern("^[0-9]*$")],]
    })

    //failure form
    this.failureForm = this._formBuilder.group({
      title: 'Error',
      message: 'Error While Adding Iamge',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: false,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Ok'
        })
      }),
      dismissible: true
    });

    //sucess form
    this.sucessForm = this._formBuilder.group({
      title: 'Sucess',
      message: 'Images Hasbeen Saved',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:information-circle',
        color: 'info'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: false,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Ok'
        })
      }),
      dismissible: true
    });
    this.defaultSelectedPrivacy="1";
  }


  //call API
  uploadImages() {
    
    let nonAddedTag = this.stepper2Formgroup.get('tag').value;

    if (nonAddedTag) {
      let pos = this.imageTags.indexOf(nonAddedTag);
      if (pos < 0 || this.imageTags.length < 1) {
        this.imageTags.push(nonAddedTag)
      }

    }
    let img = new uploadmultiImageModel();
    img.description = this.stepper2Formgroup.get('discription').value;
    img.isPublic = true;
    img.price = this.stepper2Formgroup.get('price').value;
    img.tags =this.imageTags.toString();
    img.title = this.stepper2Formgroup.get('title').value;
    img.eventId = this.data.eventId;
    img.imageFile = this.previews;
    this._eventService.addImagestoEvent(img).subscribe((data) => {
      const dialogRef = this._dialogservice.open(this.sucessForm.value);
      this.uploading_state=false;
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        this.stepper1Formgroup.reset();
        this.stepper2Formgroup.reset();
        this.dialogRef.close();
        this._eventService.getImagesByEvent(this.data.eventId).subscribe();
        
      });
    },
    (error)=>{
      this.failureForm.controls['message'].setValue("Following error occured while saving :"+error.error.message);
      const dialogRef = this._dialogservice.open(this.failureForm.value);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        this.stepper1Formgroup.reset();
        this.stepper2Formgroup.reset();
        this.previews=null;
        this.dialogRef.close();
      });
    });
  }

  selectFiles(event: any): void {
    this.previews_show_less = [];
    this.previews.push(...event.addedFiles);
    for(var i = 0; i < event.addedFiles.length; i++){
      if(i<=3) this.previews_show_less.push(this.previews[i]);
    }
    this.readFile(this.previews[0]).then(fileContents => {
      
      console.log(fileContents);
    })
  }

  private async readFile(previews: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${previews.name}.`);
        return reject(null);
      };
  
      if (!previews) {
        console.error('No file to read.');
        return reject(null);
      }
      reader.readAsDataURL(previews);
    });
  }

  


  deleElement(item: any): void {
    this.previews.splice(this.previews.indexOf(item), 1);
    this.previews_show_less = [];
    for(var i = 0; i < this.previews.length; i++){
      if(i<=3) this.previews_show_less.push(this.previews[i]);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.imageTags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();


   
  }
  removeTag(fruit: string): void {
    const index = this.imageTags.indexOf(fruit);

    if (index >= 0) {
      this.imageTags.splice(index, 1);
     this.stepper2Formgroup.get('tag').setValue(this.imageTags)
    }
  }

  PrivacyChange(event: MatSelectChange){
    this.stepper2Formgroup.get('public').setValue(event.value==1?true:false);
  }

  fileChangeHandler(file, index) {
    console.log(index);
    this.service.open(file, {
      aspectRatio: 4 / 3,
      autoCropArea: 1
    }).subscribe(data => {

      this.previews[index] = data.file;
      this.previews_show_less = [];
      for(var i = 0; i < this.previews.length; i++){
        if(i<=3) this.previews_show_less.push(this.previews[i]);
      }
    });
  }
}
