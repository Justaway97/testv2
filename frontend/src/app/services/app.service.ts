import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private static URL_HOME = '/main';

    constructor(
        private http: HttpClient,
    ) { }
    
    getHome(): Observable<any> {
        return this.http.get(AppService.URL_HOME, { withCredentials: true });
    }
}