import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'app/services/admin/admin.service';
import { approvalImage } from "app/services/admin/approvalImages.types";
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ImageDetailsComponent } from './image-details/image-details.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
  selector: 'app-image-approval',
  templateUrl: './image-approval.component.html',
  styleUrls: ['./image-approval.component.scss']
})
export class ImageApprovalComponent implements OnInit {


  allApprovalImages: approvalImage[];
  public delConfirmForm: FormGroup;

  displayedColumns = ['imageId','Image', 'createdAt', 'title','label', 'useremail', 'action'];
  dataSource: MatTableDataSource<approvalImage>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private _adminService: AdminService, private _changeDetectorRef: ChangeDetectorRef,
     private _matDialog: MatDialog,
     private _dialogservice: FuseConfirmationService,
     private _formBuilder: FormBuilder,) {

  }



  ngOnInit(): void {
    
 this.loadGrid();
    //buidConfirm Form
    this.delConfirmForm = this._formBuilder.group({
      title: 'Confirm ?',
      message: 'Confirm to Applay Approval',
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

  OpenImageDetails(rowData:any): void {
    this._matDialog.open(ImageDetailsComponent, {
        autoFocus: false,

          data: {
            dataKey: rowData
          }
        
    });
}

  updateApproval(imageGuid: string, approval: boolean) {
    const dialogRef = this._dialogservice.open(this.delConfirmForm.value);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        //======================delete action for image==============================
        
        // const index: number = this.allApprovalImages.findIndex(x=>x.imageGuid==imageGuid);
        // console.log(index);
        // delete this.allApprovalImages[index];
        this._adminService.addApproval(imageGuid).subscribe(data=>{
         this.loadGrid();
        })
       
        //===========================================================================
      }
      else {
        console.log('canceled');
      }
    });
  }
  loadGrid(){
    this._adminService.getImagesNeedApproval().subscribe((data: approvalImage[]) => {

      this.allApprovalImages = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getcolor():string {
   return "primary"
 }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

}



