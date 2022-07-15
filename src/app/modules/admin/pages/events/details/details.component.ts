import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, debounceTime, map, Observable, Observer, of, Subject, switchMap, takeUntil } from 'rxjs';
import { EventsService } from 'app/services/events/events.service';
import { eventsModel, imageModel, eventBaseModel, uploadImageModel, eventByIdmodel } from 'app/services/events/events.model';
import { Label, Event, Task } from '../events.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSelectChange } from '@angular/material/select';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize, GalleryConfig } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'notes-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsDetailsComponent implements OnInit, OnDestroy {
    note$: Observable<Event>;
    labels$: Observable<Label[]>;
    items: GalleryItem[];
    noteChanged: Subject<Event> = new Subject<Event>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public imageDetailsForm: FormGroup;
    public sucessForm: FormGroup;
    public failureForm: FormGroup;
    public delConfirmForm: FormGroup;
    imageItem: uploadImageModel;
    imagepath: string;
    editFlag: boolean = false;
    lbl_titile: string;
    lbl_discription: string;
    lbl_price: string;
    lbl_total: string;
    lbl_curentItem: string
    selectedImage: imageModel;
    allImages: imageModel[];
    images$: Observable<imageModel[]>;
    selectedImage$: BehaviorSubject<imageModel>;
    imageTags: string[] = [];
    separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
    eventDetails: eventByIdmodel;
    defaultSelectedPrivacy;
    initialImage: number;
    isImageloading: boolean = true

    /**
     * Constructor
     */
    @ViewChild('newSwiper') newSwiper: any;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data,
        private _notesService: EventsService,
        private _matDialogRef: MatDialogRef<EventsDetailsComponent>,
        private _eventService: EventsService,
        private _formBuilder: FormBuilder,
        private _dialogservice: FuseConfirmationService,
        public gallery: Gallery,
        public lightbox: Lightbox,
        private _http: HttpClient,
    ) {
    }
    get f() {
        return this.imageDetailsForm.controls;
    }

    //keyboard mapper
    // @HostListener('window:keydown.arrowright', ['$event'])
    // showPinned(event: KeyboardEvent) {
    //     event.preventDefault();
    //     this.newSwiper.activeIndex=4;
    //     this.initialImage=5;
    //     this.onNextClick();
    // }

    // @HostListener('window:keydown.arrowleft', ['$event'])
    // back(event: KeyboardEvent) {
    //     event.preventDefault();
    //     this.onPreviusClick();

    // }

    ngOnInit(): void {

        // =======================ng gallary config=============================
        const SliderConfig: GalleryConfig = {
            autoPlay: true,
            gestures: true
        };
        const lightboxRef = this.gallery.ref('lightbox');
        const sliderRef = this.gallery.ref('basic-test')
        sliderRef.setConfig(SliderConfig);


        // ==================================================================

        this.eventDetails = this._data.eventDetails;
        this.imageDetailsForm = this._formBuilder.group({
            title: ['', [Validators.required]],
            discription: ['', [Validators.required]],
            tag: [''],
            price: ['', [Validators.required, Validators.pattern("^[0-9]*$")],],
            public: []
        })
        this.images$ = this._eventService.images$;
        this.images$.subscribe((data) => {

            this.allImages = data;

            this.items = this.allImages.map(item => new ImageItem({ src: item.watermarkedImageUrl, thumb: item.thumbnailImageUrl }));

            lightboxRef.load(this.items);

            this.lbl_total = (this.allImages.length).toString();
            this.lbl_curentItem = (this.allImages.findIndex(x => x.imageId == this._data.selectedImageId) + 1).toString();
            this.initialImage = this.allImages.findIndex(x => x.imageId == this._data.selectedImageId);
            this.selectedImage = this.allImages.find(x => x.imageId == this._data.selectedImageId);
            this.updateProperty();



            sliderRef.set(this.initialImage);

        })

        this.imageItem = new uploadImageModel();


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
            message: ' Hasbeen Saved',
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

        //del form
        this.delConfirmForm = this._formBuilder.group({
            title: 'Delete Image?',
            message: 'Confirm Delete Image?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:information-circle',
                color: 'warning'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Yes',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'No'
                })
            }),
            dismissible: true
        });


    }

    ngAfterViewInit(): void {

    }

    downloadImage() {

        let imgUrl = this.selectedImage.imageUrl;

        this._http.get(imgUrl, { responseType: 'blob' }).subscribe(val => {
            console.log(val);
            const url = URL.createObjectURL(val);
           
            this.downloadUrl(url, this.selectedImage.title + "."+this.selectedImage.format);
            URL.revokeObjectURL(url);
        });
    }
    downloadUrl(url: string, fileName: string) {
        const a: any = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = 'display: none';
        a.click();
        a.remove();
    }

    closeDialoug(): void {
        this._matDialogRef.close();
    }

    toggleEdit() {
        if (this.editFlag) {
            this.editFlag = false;
        }
        else {
            this.editFlag = true;
        }
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    onNextClick(): void {
        let curentIndex = this.allImages.findIndex(x => x.imageId === this.selectedImage.imageId);
        if (curentIndex + 1 != this.allImages.length) {
            this.selectedImage = this.allImages[curentIndex + 1];
            this.lbl_curentItem = (curentIndex + 2).toString();
            this.updateProperty();
        }
    }

    onPreviusClick(): void {

        let curentIndex = this.allImages.findIndex(x => x.imageId === this.selectedImage.imageId);
        if (curentIndex != 0) {
            this.selectedImage = this.allImages[curentIndex - 1];
            this.lbl_curentItem = (curentIndex).toString();

            this.updateProperty();
        }
    }

    deleteImage(imageid: string) {

        const dialogRef = this._dialogservice.open(this.delConfirmForm.value);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                //======================delete action for image==============================
                this.onNextClick();
                this._eventService.deleteImagebyId(imageid).subscribe((data) => {
                    this._eventService.getImagesByEvent(this.selectedImage.eventId).subscribe();
                    this.images$ = this._eventService.images$;
                    this._matDialogRef.close();
                });
                //===========================================================================
            }
        });


    }

    updateProperty() {
        if (this.selectedImage) {
            this.imageDetailsForm.controls['title'].setValue(this.selectedImage.title);
            this.imageDetailsForm.controls['discription'].setValue(this.selectedImage.description);
            // this.imageDetailsForm.controls['tag'].setValue(this.selectedImage.tags);
            this.imageDetailsForm.controls['price'].setValue(this.selectedImage.price);
            this.imageDetailsForm.controls['public'].setValue(this.selectedImage.isPublic);
            this.lbl_discription = this.selectedImage.description;
            this.lbl_price = this.selectedImage.price.toString();
            this.lbl_titile = this.selectedImage.title;

            this.imageTags = this.selectedImage.tags.split(",");

            this.defaultSelectedPrivacy = this.selectedImage.isPublic ? "1" : "0";
        }
    }

    onUpdateImage() {
        let imageDetails: uploadImageModel;
        imageDetails = new uploadImageModel();
        imageDetails.title = this.imageDetailsForm.get('title').value;
        imageDetails.description = this.imageDetailsForm.get('discription').value;
        imageDetails.tags = this.imageTags.toString();
        imageDetails.price = this.imageDetailsForm.get('price').value;
        imageDetails.isPublic = true;
        this._eventService.updateImageDetails(this.selectedImage.imageGuid, imageDetails).subscribe((data) => {
            this.selectedImage.price = imageDetails.price;
            this.selectedImage.description = imageDetails.description;
            this.selectedImage.title = imageDetails.title;
            this.selectedImage.tags = imageDetails.tags;
            const dialogRef = this._dialogservice.open(this.sucessForm.value);
            dialogRef.afterClosed().subscribe();
            this._changeDetectorRef.markForCheck();

        }, (error) => {
            this.failureForm.controls['message'].setValue("Following error occured while saving :" + error.error.message);
            const dialogRef = this._dialogservice.open(this.failureForm.value);
            dialogRef.afterClosed().subscribe((result) => {
            });
        });
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
            this.imageDetailsForm.get('tag').setValue(this.imageTags)
        }
    }

    PrivacyChange(event: MatSelectChange) {
        this.imageDetailsForm.get('public').setValue(event.value == 1 ? true : false);

    }

    onSlideChange(event) {
        console.log(event.currIndex);
        this._changeDetectorRef.markForCheck();
        this.editFlag = false;
        this.selectedImage = this.allImages[event.currIndex]

        // this.lbl_curentItem = (event[0].activeIndex + 1).toString();
        this.updateProperty();
        this._changeDetectorRef.markForCheck();
        this._eventService.updateImageViewCount(this.selectedImage.imageGuid).subscribe();
        console.log(this.selectedImage);
    }
    onLoad() {
        this.isImageloading = false;
    }

}