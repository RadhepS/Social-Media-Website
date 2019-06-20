import {Component, Inject} from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FollowListData } from '../follow-list-data';




@Component({
  templateUrl: 'list-modal.component.html',
  styleUrls: ['./list-modal.component.css']
})
export class ListModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToUserPage(name: string) {
    this.router.navigate([`/user/${name}`]);
    this.dialogRef.close();
  }

}
