import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/services/user/user.service';
import { MasterService } from 'app/services/masterData/masterData.type';
import { Observable } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    styles         : [` mat-slide-toggle {
        margin: 8px 0;
        display: block;
      }`],
    animations   : fuseAnimations,
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    @ViewChild('profileFileInput') private _profileFileInput: ElementRef;

    accountForm : FormGroup;
    countries   : Observable<any>;
    interests   : Observable<any>;
   
    showAlert: boolean = false;
    //Alert
    alert: { type: FuseAlertType; message: string, appearance: string } = {
        type   : 'success',
        message: '',
        appearance: 'fill'
    };
    profilePhoto: string;
    wantToChangeProfilePhoto: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _masterService: MasterService,
        private _changeDetectorRef: ChangeDetectorRef,

        )
    {
        this.countries=_masterService.getCountries();
        this.interests=_masterService.getInterests();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.accountForm = this._formBuilder.group({
            firstName       : ['', [Validators.required]],
            lastName        : ['', [Validators.required]],
            username        : [''],
            interest        : [[''],[Validators.required]],
            status          : [''],
            mobile          : ['', [Validators.required]],
            countryId       : [''],
            discloseLocation: [''],
            isPublic        : [''],
            password        : [''],
            latitude        : [''],
            longitude       : [''],
            profession      : [''],
            stripeId        : [''],
            aboutMe         : ['']
        });

      this.fetch();
      this._changeDetectorRef.markForCheck();
    }

    fetch(): void{
        this._userService.getUserById().subscribe(response=> {
            this.profilePhoto = response.profilePhoto;
            this.accountForm.patchValue({
                firstName       : response.firstName,
                lastName        : response.lastName,
                username        : response.email,
                countryId       : response.country.countryId,
                mobile          : response.mobile,
                status          : response.status,
                interest        : response.interest?.map(i => i.name),
                discloseLocation: response.discloseLocation,
                isPublic        : response.isPublic,
                password        : '',
                latitude        : response.latitude,
                longitude       : response.longitude,
                profession      : response.profession,
                stripeId        : response.stripeId,
                aboutMe         : response.aboutMe
            });
        },
        (err)=> {
            this.alert = {
                type   : 'error',
                message: `Failed to load the profile details !`,
                appearance: 'fill'
            };
            this.showAlertBox();
            this.closeAlertBox(3000);
        });
    }

    update(): void{
        if ( this.accountForm.invalid )
        {
            return;
        }
        this._userService.updateUser(this.accountForm.value).
            subscribe((response)=> {
                this.fetch();
                 // Set the alert
                 this.alert = {
                    type   : 'success',
                    message: `Sucessfully updated the profile details !`,
                    appearance: 'fill'
                };
                this.showAlertBox();
                this.closeAlertBox(3000);
            },
                (error)=> {  
                    this.alert = {
                        type   : 'error',
                        message: `Failed to updated the profile details !`,
                        appearance: 'fill'
                    };
                    this.showAlertBox();
                    this.closeAlertBox(3000);
            });
    }

    uploadProfilleImage(fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];
        
        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }
        if (file) {
        // Upload the profile image
        const formData: FormData = new FormData();
        formData.append('imageFile', file);
        this._userService.uploadProfilePhoto(formData).subscribe(res =>{
            if(res.isSuccess){
                  // Set the alert
                this.alert = {
                    type   : 'success',
                    message: `Sucessfully changed the profile photo !`,
                    appearance: 'fill'
                };
                this.showAlertBox();
                this.fetch();
                this.isEnablePhotoProfile();
                this.closeAlertBox(3000);
                }else{
                    this.alert = {
                        type   : 'error',
                        message: `Changing profile photo failed !`,
                        appearance: 'fill'
                    };
                    this.showAlertBox();
                    this.closeAlertBox(3000);
                }
               
            },
            err=> {
                this.alert = {
                    type   : 'error',
                    message: `Changing photoprofile failed !`,
                    appearance: 'fill'
                };
                this.showAlertBox();
                this.closeAlertBox(3000);
            });
       
        }
        this._changeDetectorRef.markForCheck();
    }

    removeProfilePhoto(): void
    {
        this._userService.deleteProfilePhoto().subscribe(res =>{
            if(res.isSuccess){
               this.profilePhoto = null;
                 // Set the alert
                this.alert = {
                    type   : 'success',
                    message: `Sucessfully removed the profile photo !`,
                    appearance: 'fill'
                };
                this.showAlertBox();
                this.fetch();
                this.isEnablePhotoProfile();
                this.closeAlertBox(3000);
                }else{
                    this.alert = {
                        type   : 'error',
                        message: `Removing profile failed !`,
                        appearance: 'fill'
                    };
                    this.showAlertBox();
                    this.closeAlertBox(3000);
                }
               
            },
            err=> {
                this.alert = {
                    type   : 'error',
                    message: `Removing photoprofile failed !`,
                    appearance: 'fill'
                };
                this.showAlertBox();
                this.closeAlertBox(3000);
            });

    }

    isEnablePhotoProfile(){
        this.wantToChangeProfilePhoto = !this.wantToChangeProfilePhoto;
    }

    showAlertBox(){
        this.showAlert = true;
        this._changeDetectorRef.markForCheck();
    }

    closeAlertBox(time: number): void{
        setTimeout(() => {
            this.showAlert = false;
            this._changeDetectorRef.markForCheck();
        }, time+500);
    }
}
