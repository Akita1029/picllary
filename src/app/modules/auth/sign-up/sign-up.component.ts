import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/services/auth/auth.service';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    styles: [`.mat-radio-button ~ .mat-radio-button {
        margin-left: 16px;
      }`]
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
    )
    {
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
        this.signUpForm = this._formBuilder.group({
                firstName       : ['', Validators.required],
                lastName        : [''],
                isPhotographer  : ['', Validators.required],
                email           : ['', [Validators.required, Validators.email]],
                password        : ['', Validators.required],
                mobile          : [0, Validators.required],
                agreements      : ['', Validators.requiredTrue]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
             // Set the alert
             this.alert = {
                type   : 'error',
                message: 'Please fill details'
            };

            // Show the alert
            this.showAlertBox();
            this.closeAlertBox(3000);
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) => {
                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Signup successfully :)'
                    };

                    this.showAlertBox();
                   setTimeout(() => {
                        // Navigate to the confirmation required page
                    this._router.navigateByUrl('/signed-in-redirect');
                   }, 3000);
                },
                (err) => {
                    
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlertBox();
                    this.closeAlertBox(3000);

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();
                }
            );
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
