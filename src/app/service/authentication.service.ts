import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { catchError, delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Headings } from '../core/sidenav';
import * as _ from 'lodash';
import { jwtDecode } from "jwt-decode";
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {


  constructor(
    private ngxLoader: NgxUiLoaderService,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    @Inject(DOCUMENT) public document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
    // , private breakpointObserver: BreakpointObserver,
  ) {
  }
  
  applyThemeToDocument(color: string, btnColor: string,bgColor: string,) {
    this.document.documentElement.style.setProperty('--primary-color', color || '#00abd3');
    this.document.documentElement.style.setProperty('--primary-btn-color', btnColor || '#00abd3');
    this.document.documentElement.style.setProperty('--primary-bg-color', bgColor || '#00abd3');
  }

  loadCount = 0;
  // domain = '127.0.0.1:8000';
  domain = 'test.securitytroops.in'
  // domain = 'api.securitytroops.com'
  // domain = '192.168.1.88:8000';

  // baseUrl: string = 'http://'+this.domain;
  // socketUrl: string = 'ws://'+this.domain;
  baseUrl: string = 'https://' + this.domain;
  socketUrl: string = 'wss://' + this.domain;
  apiUrl: string = this.baseUrl + '/stapi/v1/';
  jsonAPI = false;
  companiesList: any[] = []
  appleId: any = 'security-troops/id6599849212'
  playId: any = 'com.securitytroops'
  public loadingToken: boolean = false
  public accessToken: any
  public loadPage: boolean = false
  public loggedIn = new BehaviorSubject<boolean>(false);

  public get RAZORPAY_KEY_ID () {
    return this.domain == 'api.securitytroops.com' ? "rzp_live_16bOIgJg2SPnRg" : "rzp_test_By62H8BTkC4EMR" 
  }
  public get RAZORPAY_KEY_SECRET () {
    return this.domain == 'api.securitytroops.com' ? "LeF8P47feFM8m0FlCDTkSLpW" : "4ovk5W2hb1I587hmfMqDUU8m" 
  }

  public appStore = `https://apps.apple.com/in/app/${this.appleId}`
  public playStore = `https://play.google.com/store/apps/details?id=${this.playId}`

  public facebook = 'https://www.facebook.com/stroops007'
  public instagram = 'https://www.instagram.com/stroops007'
  public twitter = 'https://twitter.com/securitytroops'
  public linkedin = 'https://www.linkedin.com/company/securitytroops'
  public youtube = 'https://www.youtube.com/@SecurityTroops'

  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result: { matches: any; }) => result.matches), shareReplay());
  mobileView = false
  loaderShow = true
  searchText = ''
  headersList: any = _.cloneDeep(Headings)

  public getMobileView(): any {
    // this.breakpointObserver.observe([Breakpoints.Handset])
    //   .subscribe(result => {
    //     if (result.matches) {
    //       this.mobileView = true;
    //     }
    //   });
  }
  getYear(): any {
    let currentYear = new Date().getFullYear() 
    let years:any = []
    for (let i = 0; i < 6; i++) {
      years.push(currentYear - i);
    }
    return years
  }

  public goToHome(error = false) {
    if (error) {
      this._snackBar.open('Not Allowed', '', { duration: 3000, panelClass: ['snackbar_danger'] });
    }
    this.router.navigateByUrl('app')
  }

  public get userValue(): any {
    if (isPlatformBrowser(this.platformId)) {
      const decodedUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('user') || btoa('{}')))));
      return decodedUser
    }
    return {}
  }

  public get currentCompanyValue(): any {
    if (isPlatformBrowser(this.platformId)) {
      const decodedCompany = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('company') || btoa('{}')))));
      return decodedCompany
    }
    return {}
  }

  changeCompany(data: any) {
    this.applyThemeToDocument(data?.color,data?.btncolor,data?.bgcolor)
    if (data) {
      const jsonString = JSON.stringify(data);
      const encodedCompany = btoa(unescape(encodeURIComponent(jsonString)));
      localStorage.setItem('company', encodedCompany);
    }
    this.headersList = _.cloneDeep(Headings)
    for (let key of Object.keys(this.headersList)) {
      this.headersList[key] = this.headersList[key].filter((item: any) => {
        item.subheadings = item.subheadings.filter((el: any) => {
          return this.showItem(el)
        })
        return this.showItem(item)
      })
    }
  }

  showItem(item: any) {
    let role: any = this.currentCompanyValue?.me?.role
    let profession: any = this.userValue?.profession
    if (item?.role?.includes(role) || item?.profession?.includes(profession)) {
      return true;
    }
    return false;
  }

  public get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  private isYesterday(date: Date, now: Date): boolean {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }
  private padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  timeAlgorithm(value: any) {
    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
      return 'now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (this.isYesterday(date, now)) {
      return 'yesterday';
    } else if (diffInSeconds > 604800) {
      return `${date.getFullYear()}-${this.padNumber(date.getMonth() + 1)}-${this.padNumber(date.getDate())}`;
    } else {
      const days = date.getDay();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return daysOfWeek[days];
    }
  }

  addDomainToUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    } else {
      return `${this.baseUrl}${url}`;
    }
  }

  login(data: any) {
    if (data.userName !== '' && data.password !== '') {
      this.loggedIn.next(true);
      this.router.navigate(['/']);
    } else {
      this.logout();
    }
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  saveFile(blob: Blob, fileName: string): void {
    const downloadLink = this.document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = fileName;
    this.document.body.appendChild(downloadLink);
    downloadLink.click();
    this.document.body.removeChild(downloadLink);
  }

  extractFileNameFromUrl(url: string): string {
    const segments = url.split('/');
    const fileNameWithExtension = segments[segments.length - 1];
    const fileNameParts = fileNameWithExtension.split('.');
    if (fileNameParts.length > 1) {
      fileNameParts.pop();
      return fileNameParts.join('.');
    }
    return fileNameParts[0];
  }

  getAPI(url: any, params: any = {}, next = false): Observable<any> {
    return this.http.get(next ? url : this.apiUrl + url, { params: params });
  }

  postAPI(url: any, params: any): Observable<any> {
    params.locate = ''
    if(params?.notLoadingToken){
      this.loadingToken = true;
    }
    return this.http.post(this.apiUrl + url, params);
  }

  postJson(url: any, params: any): Observable<any> {
    this.jsonAPI = true
    params.locate = ''
    let formData: any = this.getFormData(params, true);
    return this.http.post(this.apiUrl + url, formData);
  }

  postForm(url: any, params: any): Observable<any> {
    this.jsonAPI = true
    // params.locate=''
    let formData: any = this.getFormData(params);
    return this.http.post(this.apiUrl + url, formData);
  }

  putAPI(url: any, params: any): Observable<any> {
    params.locate = ''
    return this.http.put(this.apiUrl + url, params);
  }

  patchAPI(url: any, params: any): Observable<any> {
    params.locate = ''
    return this.http.patch(this.apiUrl + url, params);
  }

  patchForm(url: any, params: any): Observable<any> {
    params.locate = ''
    this.jsonAPI = true
    let formData: any = this.getFormData(params);
    return this.http.patch(this.apiUrl + url, formData);
  }

  getFormData(params: any, jsonData = false) {
    let formData: any = new FormData();
    for (let i = 0; i < params.length; ++i) {
      let key = Object.keys(params[i])[0];
      let prm = params[i][0];
      formData.append(key, (jsonData ? JSON.stringify(params[i][key]) : params[i][key]));
    }
    return formData;
  }

  deleteAPI(url: any): Observable<any> {
    return this.http.delete(this.apiUrl + url);
  }

  filterCompanies(list: any[]) {
    let companyList: any[] = list;
    companyList = companyList?.filter(item => {
      let isValid = item?.employees?.find((emp: any) => (emp?.user == this.userValue?.id))
      if (isValid) {
        return item
      }
    })
    return companyList
  }

  convertToPlain(html: any) {
    let tempDivElement = this.document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  decodeSecret(text: any) {
    const encodedText = `${String(text)}`;
    let decodedText = encodedText
    try {
      decodedText = atob(encodedText)
    }
    catch {
      decodedText = encodedText
    }
    return decodedText
  }

  // filterTableData(data: any, filter: string,searchArr: any | null,keyArr: any | null){
  //   const searchTerms = filter.split(' ');
  //   const excludedFields = ['timestamp', 'utimestamp', 'locate'];
  //   const match = (obj: any, term: string) => {
  //     for (let key in obj) {
  //       if (obj.hasOwnProperty(key)&& !excludedFields.includes(key) && obj[key] !== null && obj[key] !== undefined) {
  //         const fieldValue = obj[key];
  //         if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {
  //           if (fieldValue.toString().toLocaleLowerCase().includes(term)) {
  //             return true;
  //           }
  //         }
  //         if (keyArr.includes(key) && typeof fieldValue === 'object') {
  //           for (let subKey in fieldValue) {
  //             if (fieldValue.hasOwnProperty(subKey) && searchArr.includes(subKey)) {
  //               const subFieldValue = fieldValue[subKey];
  //               if (subFieldValue !== null && subFieldValue !== undefined &&
  //                   subFieldValue.toString().toLocaleLowerCase().includes(term)) {
  //                 return true;
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //     return false;
  //   };
  //   return searchTerms.every(term => match(data, term));
  // }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  isTokenExpired(token: string) {
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.accessToken  = decodedToken.exp * 1000;
      localStorage.setItem('expireTime',`${this.accessToken}`)
    } 
  }

  refreshToken() {
    let userData = this.userValue?.id ? this.userValue : null;
    this.loaderShow = false
    this.postAPI('api/token/refresh/', { 'refresh': userData?.token?.refresh,'notLoadingToken':true }).subscribe({
      next:(res)=> {
        this.loadPage = true;
        this.loadingToken = false;
        this.isTokenExpired(res?.access);
        userData.token.access = res?.access;
        localStorage.setItem('token', res?.access);
        const jsonString = JSON.stringify(userData);
        const encodedUser = btoa(unescape(encodeURIComponent(jsonString)));
        localStorage.setItem('user', encodedUser);
      },
      error: (err) => {
        console.error('Failed to refresh token', err);
        this.loadingToken = false;
        this.loadPage = true;
      }
    });
  }

  stripChar(event:any){
      const invalidChars = ['+', '-', '.', 'e'];
      if (invalidChars.includes(event.key)) {
          event.preventDefault();
      }
  }
}
