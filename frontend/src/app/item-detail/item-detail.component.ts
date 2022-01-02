import { identifierModuleUrl } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../services/app.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  @Output() toggleSideNav = new EventEmitter();
  @Input() selectedRow: any;
  itemDetailForm: FormGroup;
  fileToUpload: any;
  imageUrl: any;
  formData = new FormData();

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private dataService: DataService,
  ) { 
    console.log('item detail constructor');
  }

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.itemDetailForm = this.formBuilder.group({
      'item_name': [this.selectedRow?.item_name? this.selectedRow.item_name: '', Validators.required],
      'quantity': [this.selectedRow?.quantity? this.selectedRow.quantity: 0, Validators.required],
      'package': [this.selectedRow?.package? this.selectedRow.package: '', Validators.required],
      'image': [{ filename:'.png',
                  content:this.selectedRow?.image? 'data:image/png;base64,'.concat(this.selectedRow.image): ''
                }, Validators.required],
      'remark': [this.selectedRow?.remark? this.selectedRow.remark: '', Validators.required],
      // image: new FormControl(null, [Validators.required, requiredFileType('png')]),
    });
    this.imageUrl = this.itemDetailForm.get('image')?.value.content;
  }

  submit() {
    if (this.selectedRow) {
      this.appService.updateItem({
        ...this.itemDetailForm.value,
        'id': this.selectedRow.item_id,
      }).subscribe((data: any) => {
        this.toggleSideNav.emit();
      })
    } else {
      this.appService.addItem(this.itemDetailForm.value).subscribe((data: any) => {
        this.toggleSideNav.emit();
      })
    }
  }

  handleFileInput(file: any) {
    
    this.fileToUpload = file.target.files.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.itemDetailForm.get('image')?.patchValue({
        'filename':file.target.files[0].name,
        'content':this.imageUrl,
      });
    }
    reader.readAsDataURL(this.fileToUpload);
  }
}
