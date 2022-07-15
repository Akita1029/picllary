import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { approvalImage } from "app/services/admin/approvalImages.types";
@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss']
})
export class ImageDetailsComponent implements OnInit {

imageDetails:approvalImage;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
   
    this.imageDetails=this.data.dataKey;
    console.log(this.imageDetails.description)

  }

}
