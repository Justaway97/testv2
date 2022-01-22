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

    findMessage(message: any) {
        return new Promise<void>((resolve) => {
            if (!this.MESSAGES) {
                this.getMessages().then(() => {
                    resolve(this.getMessageDescription(message));
                })
            } else {
                resolve(this.getMessageDescription(message));
            }
        });
    }

    getMessageDescription(message: any) {
        const description = this.MESSAGES?.find(msg => msg.message_name = message)
        if (description) {
            return description.message_description;
        }
        return message;
    }

    getMessages() {
        return new Promise<void>((resolve) => {
            this.appService.getMessage().subscribe((data: any) => {
                this.MESSAGES = data.values;
                resolve();
            }, error => {
                const dialogRef = this.dialog.open(DialogComponent, {
                                    data       : {
                                    message: error.error.error,
                                    },
              });
            });
        });
    }

    setHttpHeader() {
        
    }
}