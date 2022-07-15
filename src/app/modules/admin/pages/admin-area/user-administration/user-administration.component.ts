import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from 'app/services/admin/admin.service';
import { UserPreference, prefernce } from "app/services/admin/userprefernce.types";
import { UserService } from 'app/services/user/user.service';
import { Observable } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { Options } from '@angular-slider/ngx-slider';
@Component({
  selector: 'app-user-administration',
  templateUrl: './user-administration.component.html',
  styleUrls: ['./user-administration.component.scss'],

})
export class UserAdministrationComponent implements OnInit {



  constructor(private _adminService: AdminService, private _userServices: UserService, private _changeDetectorRef: ChangeDetectorRef) { }

  allUsers$: Observable<UserPreference[]>;
  selectedUserId: number;
  allusers: UserPreference[] = [];
  masterallusers: UserPreference[] = [];
  selectedUser: UserPreference;
  seltedUsersDP: string;
  totalUsercount: number = 0;
  isPrefernceSaving: boolean = false;

  value: number = 123;
  storageOptions: Options = {
    ceil: 1000
  };
  imageCountOptions: Options = {
    ceil: 1000
  };


  ngOnInit(): void {
    this._adminService.getAllUsersforAdministration().subscribe((data: UserPreference[]) => {

      this.allusers = data.sort((a, b) => a.firstName.localeCompare(b.firstName));
      this.masterallusers = Object.assign({}, data);
      this.totalUsercount = this.allusers.length;

    });
  // Mark for check
  this._changeDetectorRef.markForCheck();
  }

  showAlert: boolean = false;
  //Alert
  alert: { type: FuseAlertType; message: string, appearance: string } = {
    type: 'success',
    message: '',
    appearance: 'outline'
  };

  toggleselectUser(userId: number) {
    if (this.selectedUserId == userId) {
      this.selectedUserId = null;
      this.selectedUser = null;
      this.seltedUsersDP = null;
    }
    else {
      this.selectedUserId = userId;
      this.selectedUser = this.allusers.filter(x => x.userId === userId)[0];
      this.imageCountOptions = { floor:this.selectedUser.totalImageCount, ceil: 1000 };
      this.storageOptions = { floor:this.selectedUser.usedStorage, ceil: 1000 };
      this.selectedUser.allowedStorage=this.selectedUser.allowedStorage/1000;
      this.selectedUser.usedStorage=parseFloat((this.selectedUser.usedStorage/1000).toFixed(2));

    }
  }


  cancelEdit() {
    this.selectedUserId = null;
    this.selectedUser = null;
    this.seltedUsersDP = null;
  }

  onUserSearchChange(searchValue: string): void {
    this.allusers = (Object.values(this.masterallusers).filter(x => x.firstName.toLowerCase().includes(searchValue.toLowerCase())));
  }

  showAlertBox() {
    this.showAlert = true;
    this._changeDetectorRef.markForCheck();
  }
  closeAlertBox(time: number): void {
    setTimeout(() => {
      this.showAlert = false;
      this._changeDetectorRef.markForCheck();
    }, time + 500);
  }
  onSettingSave(event) {
    event.preventDefault();
    this.isPrefernceSaving = true;

    let curentPrefernce: prefernce = {
      allowedImageCount: this.selectedUser.allowedImageCount,
      allowedStorage: this.selectedUser.allowedStorage * 1000,
      isActive: this.selectedUser.isActive
    };
    this._adminService.updateUserPrefernce(this.selectedUser.userId, curentPrefernce).subscribe((data) => {
      this.alert = {
        type: 'success',
        message: `Settings Saved!`,
        appearance: 'outline'
      };
      this.showAlertBox();
      this.isPrefernceSaving = false;
      this.closeAlertBox(3000);
    },
      (error) => {
        this.alert = {
          type: 'error',
          message: `Error while saving settings !`,
          appearance: 'outline'
        };
        this.showAlertBox();
        this.isPrefernceSaving = false
        this.closeAlertBox(3000);
      }
    );
  }

  onUserEnableChange(event) {
    this.selectedUser.isActive = event.checked;
  }

}
