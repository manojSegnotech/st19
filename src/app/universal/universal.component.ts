import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BasicModule } from '../shared/modules/basic/basic.module';

@Component({
    selector: 'app-universal',
    templateUrl: './universal.component.html',
    styleUrls: ['./universal.component.scss'],
    imports:[BasicModule],
    animations: [
        trigger('scrollAnimation', [
            state('show', style({
                opacity: 1,
                transform: 'translateY(0)'
            })),
            state('hide', style({
                opacity: 0,
                transform: 'translateY(-100%)'
            })),
            transition('show => hide', animate('300ms ease-out')),
            transition('hide => show', animate('300ms ease-in'))
        ])
    ],
})
export class UniversalComponent {
  windowScrolled: boolean | undefined;
  panelOpenState = false;
  profileOpenState = false;
  isLogin = false;
  mobileView: boolean = false
  profile:any;
  selectedCompany:any
  currentYear = new Date().getFullYear()
  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe( map(result => result.matches),shareReplay() );
  isHandset$ = false
  constructor(@Inject(DOCUMENT) private document: Document,private dialog:MatDialog,private breakpointObserver: BreakpointObserver, public router:Router, public auth:AuthenticationService,private _snackBar: MatSnackBar){
      this.selectedCompany = auth.currentCompanyValue
      document.body.classList.remove('dashboard')
  }

  ngOnInit(): void {
    this.profile = this.auth.userValue;
    this.isLogin = this.profile?.is_active;
    this.mobileView = this.auth.mobileView
  }
  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (window.pageYOffset || this.auth.document.documentElement.scrollTop || this.auth.document.body.scrollTop > 100) {
          this.windowScrolled = true;
      } 
     else if (this.windowScrolled && window.pageYOffset || this.auth.document.documentElement.scrollTop || this.auth.document.body.scrollTop < 10) {
          this.windowScrolled = false;
      }
  }
  scrollToTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
  logout(){
    this.isLogin = false;
    this.auth.postAPI('logout/',{}).subscribe(responce => {
      this.auth.logout()
    }, error => {
      this._snackBar.open('Error in logout', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    })
  }
  bugForm() {
    // let addDialog =  this.dialog.open(BugReportFormComponent, {
    //   panelClass: 'custom-popup',
    //   width: "40%",
    //   data: {
    //     title: "Report a bug",
    //   }
    // });
    // addDialog.afterClosed().subscribe(responce => {
     
    // })
  }

}
