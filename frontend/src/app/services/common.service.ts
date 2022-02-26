import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../dialog/dialog.component";
import { AppService } from "./app.service";

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    MESSAGES: any[];

    constructor(
        private appService: AppService,
        private dialog: MatDialog,
    ) { }

    setHttpHeader() {
        
    }
}