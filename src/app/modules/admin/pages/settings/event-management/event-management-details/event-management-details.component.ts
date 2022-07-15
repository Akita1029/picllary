import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { EventsService } from 'app/services/events/events.service';
import { eventsModel } from 'app/services/events/events.model';
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';
import { UserService } from 'app/services/user/user.service';
import { User } from 'app/services/user/user.types';
import { ThemePalette } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { EventManagementComponent } from '../event-management.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import moment from 'moment';

@Component({
  selector: 'app-event-management-details',
  templateUrl: './event-management-details.component.html',
  encapsulation  : ViewEncapsulation.None,
  animations   : fuseAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`.mat-radio-button ~ .mat-radio-button {
        margin-left: 16px;
      }`]
})
export class EventManagementDetailsComponent implements  OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    // datetimepicker
    @ViewChild('picker') picker: any;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public minDate= new Date();
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';
    public stepHours = [1, 2, 3, 4, 5];
    public stepMinutes = [1, 5, 10, 15, 20, 25];
    public stepSeconds = [1, 5, 10, 15, 20, 25];
    public defaultTime: any = [new Date().getHours(), new Date().getMinutes() , 0];
    //datetimepicker

    //Alert
    alert: { type: FuseAlertType; message: string, appearance: string } = {
        type   : 'success',
        message: '',
        appearance: 'fill'
    };
    showAlert: boolean = false;
    //Alert
    eventForm: FormGroup;
    selectedEventId: number;
    isPublic: boolean;

    myControl = new FormControl();
    filteredOptions: Observable<User[]>;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private __eventManagementComponent: EventManagementComponent,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _eventService: EventsService,
        private _userService: UserService,
        
    )
    {
        this.eventForm = this._formBuilder.group({
            eventName       : ['', [Validators.required]],
            eventId         : ['',[Validators.required]],
            users           : this._formBuilder.array([])

        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit(): void {
    
    }

    /**
     * On init
     */
    
    ngOnInit(): void
    {
        this.init();
        // Open the drawer
        this.__eventManagementComponent.matDrawer.open();
          
        // Toggle the edit mode off
        this.toggleEditMode(false);

        // Mark for check
        this._changeDetectorRef.markForCheck();
 
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

     
    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        this._router.navigate(['/settings']);
        return this.__eventManagementComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    
    init(){

      this._activatedRoute.params.subscribe(param=> {
        this.selectedEventId=param.eventId;
        this._eventService.getEventById(this.selectedEventId).toPromise().then(res=>{
            this.isPublic = res.isPublic;
            this.eventForm.patchValue({
                eventName: res.eventName,
                eventId  : res.eventId,
                users    : []
            }); 
            
            let i =0;
            let usersFormArray = <FormArray>this.eventForm.controls["users"];
            while (usersFormArray.length !== 0) {
                usersFormArray.removeAt(0)
            }
            if(res.eventPermission.length > 0){
                res.eventPermission.forEach(ep => {
                    this.addUserForm();
                    usersFormArray.controls[i].patchValue({
                        email               : ep.email,
                        expiresAt           : moment(ep.expiresAt),
                        haveWritePermission : ep.haveWritePermission,
                        haveReadPermission  : ep.haveReadPermission,
                        haveDeletePermission: ep.haveDeletePermission,
                        haveUploadPermission: ep.haveUploadPermission,
                        isNew               : false,
                        eventPermisionId    : ep.eventPermisionId
                   });
                   i++;
                });
            }else{
                while (usersFormArray.length !== 0) {
                    usersFormArray.removeAt(0)
                }
            }
           
        });
        this.showAlert = false;
      },
      (er)=> console.log('ROUTED FAILED'));

    }
    
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    /**
     * Form functionalities
     */
    usersFormArray() : FormArray {  
        return this.eventForm.get("users") as FormArray  
    }  

    newUserForm(): FormGroup {  
        return this._formBuilder.group({  
            email                 : ['', Validators.email],
            expiresAt             : [''],
            haveReadPermission    : [false],
            haveWritePermission   : [false],
            haveDeletePermission  : [false],
            haveUploadPermission  : [false],
            isNew                 : [true],
            eventPermisionId      : [0] 
        })  
    }  

    addUserForm(clicked?:boolean) { 
        if(clicked) {
            this.usersFormArray().insert(0, this.newUserForm()); 
        }else{
            this.usersFormArray().push(this.newUserForm()); 
        }

    }  
    
    removeUserForm(i:number) { 
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete Permission',
            message: 'Are you sure you want to delete this perimissoin? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
    });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if ( result === 'confirmed' ){
                // Show the alert
                let usersFormArray = <FormArray>this.eventForm.controls["users"];
                let eventUser =usersFormArray.controls[i].value;
                if(!eventUser.isNew){
                    this._eventService.eventDeletePermission(this.selectedEventId,eventUser.eventPermisionId).subscribe(de=>{
                        
                    });
                }
                this.usersFormArray().removeAt(i);  
                this.alert = {
                    type   : 'success',
                    message: 'Deleted successfully !',
                    appearance: 'fill'
                };
                this.showAlert = true;
                this._changeDetectorRef.markForCheck();
                setTimeout(() => {
                    this.showAlert = false;
                    this._changeDetectorRef.markForCheck();
                },2500)
            }
        });

       
    }  
     
    onSubmit() {
        // checkdateissue
        let usersFormArray = this.eventForm.controls["users"]['controls'] as FormArray[];
        let arr = usersFormArray.filter(x=> x.value['isNew'] && x.status == 'INVALID');
        if (arr.length > 0){
        this.showAlert = false;
        // Set the alert
              this.alert = {
                type   : 'error',
                message: 'Please fill required fileds !',
                appearance: 'outline'
            };

            // Show the alert
            this.showAlert = true;
            this._changeDetectorRef.markForCheck();
            setTimeout(() => {
                        this.showAlert = false;
                        this._changeDetectorRef.markForCheck();
            },2500);
            return;
        }
        let users = this.eventForm.get('users').value as [];
        const reqBody= {
            "eventId"   : this.eventForm.get('eventId').value,
            "userData"  : users.filter((x: any) => x.isNew)
        };
        this._eventService.eventAddPermission(reqBody).subscribe(res=> {
            // Set the alert
            this.alert = {
                type   : 'success',
                message: 'Sucessfully shared !',
                appearance: 'fill'
            };
            this.showAlert = true;
            this._changeDetectorRef.markForCheck();
            setTimeout(() => {
                this.showAlert = false;
                this._changeDetectorRef.markForCheck();
            },2500);

            setTimeout(() => {
                this.closeDrawer();
                this._changeDetectorRef.markForCheck();
            }, 3500);
        },
        (error)=>{
              // Set the alert
              this.alert = {
                type   : 'error',
                message: 'Failed sharing !',
                appearance: 'fill'
            };

            // Show the alert
            this.showAlert = true;
            this._changeDetectorRef.markForCheck();
            setTimeout(() => {
                this.showAlert = false;
                this._changeDetectorRef.markForCheck();
            }, 2500);
        });
    } 
}
