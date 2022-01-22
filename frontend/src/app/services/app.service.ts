import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private static URL_HOME = '/main';
    private static URL_IS_LOGGED_IN = '/isLoggedIn';
    private static URL_LOGIN = '/login';
    private static URL_ITEM_LIST = '/itemList';
    private static URL_OUTLET_LIST = '/outletList';
    private static URL_ORDER_LIST = '/orderList/<id>';
    private static URL_ORDER = '/order';
    private static URL_REGISTER = '/register';
    private static URL_ITEM = '/item';
    private static URL_PK = '/<id>';
    private static URL_OUTLET = '/outlet';
    private static URL_APPROVAL = '/approval';
    private static URL_USER = '/user';
    private static URL_WAREHOUSE = '/warehouse';
    private static URL_STATUS = '/status';
    private static URL_OPTION = '/option';
    private static URL_MESSAGE = '/message';
    private static URL_WAREHOUSE_LIST = '/warehouseList';
    private static URL_LOGOUT = '/logout';

    constructor(
        private http: HttpClient,
        private dataService: DataService,
    ) { }
    
    getHome(): Observable<any> {
        return this.http.get(AppService.URL_HOME, { withCredentials: true });
    }

    isLoggedIn(): Observable<any> {
        return this.http.get(AppService.URL_HOME.concat(AppService.URL_IS_LOGGED_IN), { withCredentials: true });
    }

    login(value: any): Observable<any> {
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_LOGIN), value, { withCredentials: true });
    }

    register(value: any) {
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_REGISTER), value, { withCredentials: true });
    }
    getItemList(searchCriteria: any): Observable<any> {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_ITEM_LIST), 
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
    }

    getOrderList(id: string, searchCriteria: any): Observable<any> {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_ORDER_LIST.replace('<id>',id)), 
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
    }

    addOrder(order: any): Observable<any> {
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_ORDER), order, {withCredentials: true});
    }

    getOrder(id: any): Observable<any> {
        return this.http.get(AppService.URL_HOME.concat(AppService.URL_ORDER).concat(AppService.URL_PK.replace('<id>',id)), {withCredentials: true});
    }

    addItem(value: any) {
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_ITEM), value, {withCredentials: true});
    }

    getItem(id: any) {
        return this.http.get(AppService.URL_HOME.concat(AppService.URL_ITEM).concat(AppService.URL_PK.replace('<id>',id)), {withCredentials: true});
    }

    updateItem(value: any) {
        const id = value.id
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_ITEM).concat(AppService.URL_PK.replace('<id>',id)), value, {withCredentials: true});
    }

    getOutletList(searchCriteria: any) {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_OUTLET_LIST),
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
    }

    addOutlet(value: any) {
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_OUTLET), value, {withCredentials: true});
    }

    addWarehouse(value: any) {
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_WAREHOUSE), value, {withCredentials: true});
    }

    updateWarehouse(value: any) {
        const id = value.id
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_WAREHOUSE).concat(AppService.URL_PK.replace('<id>',id)), value, {withCredentials: true});
    }

    getOutlet(id: any) {
        return this.http.get(AppService.URL_HOME.concat(AppService.URL_OUTLET).concat(AppService.URL_PK.replace('<id>',id)), {withCredentials: true});
    }

    updateOutlet(value: any) {
        const id = value.id
        return this.http.post(AppService.URL_HOME.concat(AppService.URL_OUTLET).concat(AppService.URL_PK.replace('<id>',id)), value, {withCredentials: true});
    }

    getApprovalUserList() {
        return this.http.get(AppService.URL_HOME.concat(AppService.URL_APPROVAL).concat(AppService.URL_USER), { withCredentials: true});
    }

    getOrderWarehouseList(searchCriteria: any) {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_ORDER)
                               .concat(AppService.URL_WAREHOUSE), 
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
    }

    getOptionItemList() {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_OPTION)
                               .concat(AppService.URL_ITEM), 
            {
                withCredentials: true
            }
        );
    }

    getOptionWarehouseList() {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_OPTION)
                               .concat(AppService.URL_WAREHOUSE), 
            {
                withCredentials: true
            }
        );
    }

    getOptionOutletList() {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_OPTION)
                               .concat(AppService.URL_OUTLET), 
            {
                withCredentials: true
            }
        );
    }

    logout() {
        return this.http.post(
            AppService.URL_HOME.concat(AppService.URL_LOGOUT),
            {},
            { 
                withCredentials: true 
            }
        );
    }

    userApproval(value: any) {
        return this.http.post(
            AppService.URL_HOME.concat(AppService.URL_USER),
            value,
            {
                withCredentials: true
            }
        );
    }

    getMessage() {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_MESSAGE),
            {
                withCredentials: true
            }
        );
    }

    getWarehouseList(searchCriteria: any) {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_WAREHOUSE_LIST),
            {
                params: this.dataService.setParamsFromSearchCriteria(searchCriteria),
                withCredentials: true
            }
        );
    }

    getWarehouse(id: any) {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_WAREHOUSE).concat(AppService.URL_PK.replace('<id>',id)),
            {
                withCredentials: true
            }
        );
    }

    getOrderStatus(id: any) {
        return this.http.get(
            AppService.URL_HOME.concat(AppService.URL_STATUS).concat(AppService.URL_PK.replace('<id>',id)),
            {
                withCredentials: true
            }
        );
    }
}