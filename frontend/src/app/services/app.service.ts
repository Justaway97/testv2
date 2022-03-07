import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private static URL_HOME = '/main';
    private static URL_IS_LOGGED_IN = '/isLoggedIn/<username>';
    private static URL_LOGIN = '/login';
    private static URL_OUTLET_LIST = '/outletList';
    private static URL_ORDER2 = '/order2';
    private static URL_REGISTER = '/register';
    private static URL_ITEM = '/item';
    private static URL_OPTION = '/option';
    private static URL_LOGOUT = '/logout';
    private static URL_ORDER2_LIST = '/order2List/<id>';
    private static URL_CANCEL = '/can';
    private static URL_ORDER2_DETAIL = '/order2/<id>';
    private static URL_DASHBOARD2 = '/dashboard2';
    private static URL_REPORT_TEMPLATE = '/reportTemplate';

    private static loadingStatus: Boolean = false;

    constructor(
        private http: HttpClient,
        private dataService: DataService,
    ) { }

    setLoadingStatus(status: Boolean) {
        AppService.loadingStatus = status;
    }
    
    getLoadingStatus(): Boolean {
        return AppService.loadingStatus;
    }
    
    getHome(): Observable<any> {
        this.setLoadingStatus(true);
        const response = this.http.get(AppService.URL_HOME, { withCredentials: true });
        return response;
    }

    isLoggedIn(username: string): Observable<any> {
        return this.http.get(AppService.URL_HOME.concat(AppService.URL_IS_LOGGED_IN.replace('<username>',username)), { withCredentials: true });
    }

    login(value: any): Observable<any> {
        this.setLoadingStatus(true);
        const response = this.http.post(AppService.URL_HOME.concat(AppService.URL_LOGIN), value, { withCredentials: true });
        return response;
    }

    register(value: any) {
        this.setLoadingStatus(true);
        const response = this.http.post(AppService.URL_HOME.concat(AppService.URL_REGISTER), value, { withCredentials: true });
        return response;
    }

    addOrder2(order: any): Observable<any> {
        this.setLoadingStatus(true);
        const response = this.http.post(AppService.URL_HOME.concat(AppService.URL_ORDER2), order, {withCredentials: true});
        return response;
    }

    getOutletList(searchCriteria: any) {
        this.setLoadingStatus(true);
        const response = this.http.get(
            AppService.URL_HOME.concat(AppService.URL_OUTLET_LIST),
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
        return response;
    }

    getOptionItemList() {
        this.setLoadingStatus(true);
        const response = this.http.get(
            AppService.URL_HOME.concat(AppService.URL_OPTION)
                               .concat(AppService.URL_ITEM), 
            {
                withCredentials: true
            }
        );
        return response;
    }

    logout() {
        const response = this.http.post(
            AppService.URL_HOME.concat(AppService.URL_LOGOUT),
            {},
            { 
                withCredentials: true 
            }
        );
        return response;
    }

    getOrder2List(id: string, searchCriteria: any) {
        this.setLoadingStatus(true);
        const response = this.http.get(
            AppService.URL_HOME.concat(AppService.URL_ORDER2_LIST.replace('<id>',id)), 
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
        return response;
    }

    getOrder2(id: string) {
        this.setLoadingStatus(true);
        const response = this.http.get(
            AppService.URL_HOME.concat(AppService.URL_ORDER2_DETAIL.replace('<id>',id)), 
            {
                withCredentials: true
            }
        );
        return response;
    }

    getDashboard2List(searchCriteria: any) {
        this.setLoadingStatus(true);
        const response = this.http.get(
            AppService.URL_HOME.concat(AppService.URL_DASHBOARD2),
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
        return response;
    }

    updateOrder2(order: any, id: string) {
        this.setLoadingStatus(true);
        const response = this.http.post(
            AppService.URL_HOME.concat(AppService.URL_ORDER2_DETAIL.replace('<id>',id)), 
            order,
            {
                withCredentials: true
            }
        );
        return response;
    }

    cancelOrder2(id: string) {
        this.setLoadingStatus(true);
        const response = this.http.post(
            AppService.URL_HOME.concat(AppService.URL_CANCEL, AppService.URL_ORDER2_DETAIL.replace('<id>',id)), 
            {
                withCredentials: true
            }
        );
        return response;
    }

    getReportTemplate() {
        this.setLoadingStatus(true);
        const response = this.http.get(
            AppService.URL_HOME.concat(AppService.URL_REPORT_TEMPLATE), 
            {
                withCredentials: true
            }
        );
        return response;
    }
}