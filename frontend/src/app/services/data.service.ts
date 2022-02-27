import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { headerMapping } from "../app.constant";


@Injectable({
    providedIn: 'root'
})
export class DataService {
    userId: string = '';
    route: string = '';
    IMAGE_FORMAT = 'data:image/png;base64,';
    PAGE_INDEX = 0;
    PAGE_SIZE = 3;
    ITEM_NAME_OPTION_LIST: any[];
    MESSAGES: any[];
    USER_ACCESS: string[] = []

    formatOrder(data: string) {
        const d = data.split('|');
        const order = d[1];
        if (order === 'desc') {
            return '-'.concat(headerMapping[d[0]]? headerMapping[d[0]]: d[0]);
        }
        return headerMapping[d[0]]? headerMapping[d[0]]: d[0];
    }

    setParamsFromSearchCriteria(searchCriteria: any) {
        const reqParams = new HttpParams()
          .set('orderBy', searchCriteria.orderBy)
          .set('pageIndex', searchCriteria.pageIndex)
          .set('pageSize', searchCriteria.pageSize)
          .set('findBy', searchCriteria.findBy);
        return reqParams;
    }

    setSearchCriteria(searchCriteria: any, event: any) {
        searchCriteria.pageIndex = event.pageIndex;
        searchCriteria.pageSize = event.pageSize;
        if (event.orderBy) {
          searchCriteria.orderBy = this.formatOrder(event.orderBy);
        }
        return searchCriteria;
    }

    setUserAccess(access: any) {
        this.USER_ACCESS = access;
    }
    
}