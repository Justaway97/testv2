import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { headerMapping } from "../app.constant";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { cloneDeep } from "lodash";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

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
    USER_ACCESS: string[] = [];

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

    getBase64ImageFromURL(url: any) {
        return new Promise((resolve, reject) => {
          let img = new Image();
          img.setAttribute('crossOrigin', 'anonymous');
          img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            let dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
          };
          img.onerror = error => {
            reject(error);
          };
          img.src = url;
        });
    }

    generateHeaderLine(hLineWidth = 12): any {
        return {
            table : {
              headerRows : 1,
              widths: ['100%'],
              body : [
                      ['']
                      ]
              },
              layout : {
                hLineWidth: function (i: number) {
                    return i === 0 ? hLineWidth : 0;
                },
                vLineWidth: function (i: number) {
                    return 0;
                },
              }
        };
    }

    async generateLogo(link: any, width = 200) {
        return {
            image: await this.getBase64ImageFromURL(
                'https://thumbs.dreamstime.com/z/google-icon-logo-simple-vector-filled-flat-google-icon-logo-solid-pictogram-isolated-white-background-159029191.jpg'
            ),
            width: width,
        }
    }
    
    async generatePdf(data: any, template: any) {
        this.test(data, template);
        //   let document = {   
        //     content: [
        //         {
        //             table : {
        //                 headerRows : 1,
        //                 widths: ['100%'],
        //                 body : [
        //                     ['']
        //                 ]
        //             },
        //             layout : {
        //                 hLineWidth: function (i: number) {
        //                     return i === 0 ? 12 : 0;
        //                 },
        //                 vLineWidth: function (i: number) {
        //                     return 0;
        //                 },
        //                 hLineColor: function (i: number) {
        //                   return 'black';
        //                 },
        //             }
        //         },
        //         {
        //             columns: [
        //                 {
        //                     stack: [
        //                       {text: 'INVOICE', style: 'header', fontSize: 36, width: '*', bold: true, color: 'grey'}
        //                     ],
        //                 },
        //                 {
        //                     image: await this.getBase64ImageFromURL(
        //                         'https://thumbs.dreamstime.com/z/google-icon-logo-simple-vector-filled-flat-google-icon-logo-solid-pictogram-isolated-white-background-159029191.jpg'
        //                     ),
        //                     width: 200,
        //                 },
        //             ]
        //         },
        //         ' ',
        //         ' ',
        //         {
        //             columns: [
        //                 {
        //                     stack: [
        //                         {text: 'FATTY BOM BOM GROUP', style: 'subheader', fontSize: 24, bold: true, width: '70%', color: 'black'},
        //                     ],
        //                 },
        //             ]
        //         },
        //         ' ',
        //         {
        //             columns: [
        //                 {
        //                     stack: [
        //                         {text: 'Order ID:', style: 'subheader', fontSize: 14, width: '30%'},
        //                     ],
        //                     width: '30%',
        //                 },
        //                 {
        //                     stack: [
        //                         {text: '1', style: 'subheader', fontSize: 14},
        //                     ],
        //                 },
        //             ]
        //         },
        //         {
        //             columns: [
        //                 {text: 'Order ID:', style: 'subheader', fontSize: 14, width: '30%'},
        //                 {text: '1', style: 'subheader', fontSize: 14},
        //             ],
        //         },
        //         {
        //             columns: [
        //                 {text: 'Order By:', style: 'subheader', fontSize: 14, width: '30%'},
        //                 {text: 'songming', style: 'subheader', fontSize: 14},
        //             ],
        //         },
        //         {
        //             columns: [
        //                 {text: 'Delivery To:', style: 'subheader', fontSize: 14, width: '30%'},
        //                 {text: 'Outlet 1', style: 'subheader', fontSize: 14},
        //             ],
        //         },
        //         {
        //             columns: [
        //                 {text: 'Order Date:', style: 'subheader', fontSize: 14, width: '30%'},
        //                 {text: '1/1/2022', style: 'subheader', fontSize: 14},
        //             ],
        //         },
        //         {
        //             columns: [
        //                 {text: 'Received Date:', style: 'subheader', fontSize: 14, width: '30%'},
        //                 {text: '1/1/2022', style: 'subheader', fontSize: 14},
        //             ],
        //         },
        //         ' ',
        //         {
        //             style: 'tableExample',
        //             table: {
        //                 widths: ['80%', '*'],
        //                 headerRows: 1,
        //                 body: [
        //                     [{text: 'Header 1', style: 'Item'}, {text: 'Header 2', style: 'Quantity', alignment: 'right'}],
        //                     ['Item 1', {text: '2', alignment: 'right'}],
        //                     ['Item 3', {text: '5', alignment: 'right'}],
        //                     ['Item 2', {text: '1', alignment: 'right'}],
        //                     ['Item 4', {text: '3', alignment: 'right'}],
        //                 ]
        //             },
        //             layout: {
        //                 hLineWidth: function (i: number) {
        //                     return i === 1 ? 2 : 0;
        //                 },
        //                 vLineWidth: function (i: number) {
        //                     return i === 1 ? 1 : 0;
        //                 },
        //                 fillColor: function (rowIndex: number, node: any, columnIndex: any) {
        //                     return (rowIndex % 2 === 0) ? 'lightgrey' : null;
        //                 }
        //             }
        //         },
        //     ],
        //   };  
        //   pdfMake.createPdf(document as any).open(); 
    }
    test(data: any, template: any[]) {
        console.log(data);
        let document: any = {}
        document.content = []
        template.forEach((element: any, index: number) => {
            if (template[index].template_type === 'Empty') {
                document.content.push(' ');
            } else {
                document.content.push(this.resolvedDefaultVariable(template[index].content, template[index].variable));
            }
        });
        // findImagePath
        // if (typeof obj[key[0]] === 'string' && obj[key[0]].startsWith('https')) {
        //     obj[key[0]] = await this.getBase64ImageFromURL(obj[key[0]]);
        // }
        pdfMake.createPdf(document as any).open(); 
        //         {
        //             table : {
        //                 headerRows : 1,
        //                 widths: ['100%'],
        //                 body : [
        //                     ['']
        //                 ]
        //             },
        //             layout : {
        //                 hLineWidth: function (i: number) {
        //                     return i === 0 ? 12 : 0;
        //                 },
        //                 vLineWidth: function (i: number) {
        //                     return 0;
        //                 },
        //                 hLineColor: function (i: number) {
        //                   return 'black';
        //                 },
        //             }
        //         },
    }
    resolvedDefaultVariable(content: any, variable: any) {
        const configurations: any = {
            widths: ['80%', '*'],
            body: [
                [{text: 'Header 1', style: 'Item'}, {text: 'Header 2', style: 'Quantity', alignment: 'right'}],
                ['Item 1', {text: '2', alignment: 'right'}],
                ['Item 3', {text: '5', alignment: 'right'}],
                ['Item 2', {text: '1', alignment: 'right'}],
                ['Item 4', {text: '3', alignment: 'right'}],
            ]
        };
        const variables: any[] = variable.split('\r\n');
        variables.forEach(element => {
            const key = element.split(':')[0];
            const value = element.split(': ')[1];
            if ((key.startsWith('function') || !(key in configurations)) && content.indexOf('<'.concat(key,'>')) !== -1) {
                content = content.replace('<'.concat(key, '>'), value);
            }
        });
        const contents: any[] = content.split('\r\n');
        let data: any = {}
        const lastKey: string[] = [];
        let isArray: any[] = [false];
        contents.forEach((element: any, index: number) => {
            const space: number = element.length - element.trim().length;
            if (isArray.length < (space/4)-1) {
                isArray.push(false);
            }
            if (element.trim().startsWith('[')) {
                isArray[(space/4)-1] = true;
            }
            if (element.trim().startsWith('}')) {
                // skip
            } else if (element.trim().startsWith(']')) {
                isArray[(space/4)-1] = false;
            } else if (index !== 0 && index !== contents.length - 1) {
                const key = this.splitOnFirstMeet(element.trim(),':');
                let obj = this.mapDataValue(data, (space / 4) - 1, lastKey, 0);
                if (key.length === 2) {
                    if (lastKey.length <= (space / 4)-1) {
                        lastKey.push(key[0]);
                        // if (isArray === 0) {
                        // } else {
                            // obj = this.mapArrayValue(data, isArray, lastKey);
                        // }
                        obj[key[0] as any] = null;
                    } else {
                        lastKey[(space / 4)-1] = key[0];
                    }
                }
                if (key[key.length-1].endsWith(',')) {
                    key[key.length-1] = key[key.length-1].substring(0, key[key.length-1].length-1);
                }
                if (!!!isArray[Math.max((space/4)-2,0)]) {
                    obj[key[0]] = this.resolvedDataType(key[key.length-1]);
                    if (Array.isArray(obj[key[0]])) {
                        isArray[Math.max((space/4)-1,0)] = true;
                    }
                } else if (!!isArray[Math.max((space/4)-2,0)]) {
                    let objArray = this.mapArrayValue(obj, this.countIsArray(isArray, (space/4)-2), lastKey);
                    objArray.push(this.resolvedDataType(key[key.length-1]));
                    if (Array.isArray(objArray[objArray.length-1])) {
                        isArray[Math.max((space/4)-1,0)] = true;
                    }
                }
                if (typeof obj[key[0]] === 'function') {
                    const f = new Function('return function hLineWidth(i) { return i === 0 ? 12 : 0;}')();
                    obj[key[0]] = new Function(key[key.length-1].substring(0, key[key.length-1].length))();
                }
            }
        });
        const configurationList: any[] = Object.keys(configurations)
        configurationList.forEach(element => {
            this.mapFieldValue(data, element, configurations[element]);
        })
        return data;
    }

    countIsArray(isArray: any[], index: number) {
        let count = 0;
        isArray.forEach((element: any, i: number) => {
            if (index > i) {
                count = !!element? count+1 : count-1;
            }
        });
        return Math.max(count, 0);
    }

    mapFieldValue(data: any, configuration: any, value: any): any {
        if (typeof data !== 'object') {
            return;
        }
        const key: any[] = Object.keys(data);
        for (const k of key) {
            if (typeof data[k] === 'string' && data[k] === '<'.concat(configuration, '>')) {
                data[k] = cloneDeep(value);
                value = null;
                return;
            }
            if (data[k]) {
                this.mapFieldValue(data[k], configuration, value);
            }
        }
    }
    
    mapDataValue(data: any, count: number, lastKey: string[], lastKeyIndex: number): any {
        if (count === 0) {
            return data;
        }
        return this.mapDataValue(data[lastKey[lastKeyIndex]] ? data[lastKey[lastKeyIndex]] : data[data.length-1],
            count-1, lastKey, data[lastKey[lastKeyIndex]] ? lastKeyIndex+1 : lastKeyIndex);
    }

    mapArrayValue(data: any, count: number, lastKey: string[]): any {
        if (count === 0) {
            return data;
        }
        return this.mapArrayValue(data[lastKey[lastKey.length-1]] ? data[lastKey[lastKey.length-1]] : data[data.length-1],
            count-1, lastKey);
    }

    resolvedDataType(key: any) {
        if (key === '{') {
            return {};
        }
        if (key === '[') {
            return [];
        }
        if (key.startsWith('return')) {
            return Function();
        }
        if (key === '\'\'') {
            return '';
        }
        if (!isNaN(Number(key))) {
            return Number(key);
        }
        if (key === 'true') {
            return true;
        }
        if (key === 'false') {
            return false;
        }
        return key;
    }

    splitOnFirstMeet(value: any, key: any): any {
        const index = value.indexOf(key);
        if (index === -1) {
            return [value];
        }
        return [value.substring(0,index),value.substring(index+1, value.length)];
    }
}