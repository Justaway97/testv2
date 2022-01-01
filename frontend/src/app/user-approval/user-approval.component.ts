import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.scss']
})
export class UserApprovalComponent implements OnInit {

  @Output() toggleSideNav = new EventEmitter();
  @Input() selectedRow: any;
  approvalUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
  ) { 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedRow' in changes) {
      this.selectedRow = changes['selectedRow'].currentValue;
      this.reset();
    }
  }
  
  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.approvalUserForm = this.formBuilder.group({
      'username': [this.selectedRow.username? this.selectedRow.username: '', Validators.required],
      'role': [this.selectedRow.role? this.selectedRow.role: '', Validators.required],
      'handphone_number': [this.selectedRow.handphone_number? this.selectedRow.handphone_number: '', Validators.required],
      'full_name': [this.selectedRow.full_name? this.selectedRow.full_name: '', Validators.required],
    });
  }

  submit() {
    console.log(this.approvalUserForm.value);
    if (!this.selectedRow) {
      this.appService.addOrder(this.approvalUserForm.value).subscribe((data: any) => {
        if (data.values.success) {
          console.log('Data successfully added!');
          this.toggleSideNav.emit();
        }
      })
    }
    // this.appService.addOrder()
  }
}
