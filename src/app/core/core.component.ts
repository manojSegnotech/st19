import { Component, OnInit, ViewChild, ViewEncapsulation,Renderer2 } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BasicModule } from '../shared/modules/basic/basic.module';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map, shareReplay } from 'rxjs/operators';
import { Headings } from './sidenav';
import { AuthenticationService } from '../service/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { PushNotificationService } from '../service/push-notification.service';
import { UntypedFormBuilder, Validators, FormGroup, } from '@angular/forms';

@Component({
  selector: 'app-core',
  imports: [BasicModule],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
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
export class CoreComponent implements OnInit {
  selectedIds: any[] = []
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('drawer') drawer!: MatSidenav;
  selectedCompany: any;
  panelOpenState = false;
  profileOpenState = false;
  company: any = {};
  profile: any;
  notifyBar: boolean = false
  notifications: any[] = []
  headersList = _.cloneDeep(Headings)
  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches), shareReplay());
  isHandset$:boolean=false
  MemberList: any = ['Owner', 'Admin', 'Manager', 'Representative', 'Employee', 'Client', 'Professional']
  mobileView: boolean = false
  notifyCount = 0
  companiesLoaded = false
  fullScreen:boolean = false

  constructor(public router: Router, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver, public auth: AuthenticationService, private dialog: MatDialog, private _snackBar: MatSnackBar, private pushNotification: PushNotificationService
    , private fb: UntypedFormBuilder,private renderer: Renderer2) {
    this.profile = this.auth.userValue;
    this.getNotifications()
    document.body.classList.add('dashboard')
  }

  getNotifications(next = false, path = 'notifications/') {
    let params: any = {}
    if (this.profile?.id) {
      params.user = this.profile.id
    }
    params.archive = false
    params.limit = 50
    this.auth.getAPI(path, params).subscribe({
      next: (responce) => {
        // if(responce.count > 50){
        //   this.notifications = [this.notifications,...responce['results']]
        //   if(responce.next){
        //   }
        // }
        // else{
        //   this.notifications = responce['results']
        // }
        this.notifications = responce['results']
        this.notifyCount = this.notifications.filter(item => item.read === false).length
      }, error: error => {
        this._snackBar.open('Error in loading notifications', '', { duration: 5000, panelClass: ['snackbar_danger'] });
      }
    })
  }

  timeAlgo(value: any) {
    return this.auth.timeAlgorithm(value)
  }

  close(reason: string) {
    this.sidenav.close();
  }
  drawerClose(reason: string) {
    this.drawer.close();
  }

  ngOnInit(): void {
    this.getCompanies()
    this.mobileView = this.auth.mobileView
  }

  getCompanies() {
    this.auth.getAPI('agency/company/').subscribe(result => {
      this.auth.companiesList = this.auth.filterCompanies(result['results']);
      let indexx = 0;
      let localScomp = this.auth.currentCompanyValue;
      if (Object.keys(localScomp).length === 0) {
        localStorage.removeItem('company');
        if (this.auth.companiesList.length > 0) {
          const jsonString = JSON.stringify(this.auth.companiesList[0]);
          const encodedCompany = btoa(unescape(encodeURIComponent(jsonString)));
          localStorage.setItem('company', encodedCompany);
          this.auth.changeCompany(this.auth.companiesList[0]);
          this.selectedCompany = this.auth.companiesList[0];
          this.company = this.auth.companiesList[0]
        }
      } else {
        indexx = this.auth.companiesList.findIndex((cmp: any) => cmp.identifier === this.auth.currentCompanyValue?.identifier);
        if (indexx === -1) {
          if (this.auth.companiesList.length > 0) {
            const jsonString = JSON.stringify(this.auth.companiesList[0]);
            const encodedCompany = btoa(unescape(encodeURIComponent(jsonString)));
            localStorage.setItem('company', encodedCompany);
            this.auth.changeCompany(this.auth.companiesList[0]);
            this.company = this.auth.companiesList[0];
          } else {
            localStorage.removeItem('company');
          }
        } else {
          this.auth.changeCompany(this.auth.companiesList[indexx]);
          this.company = this.auth.companiesList[indexx];
        }
        this.selectedCompany = this.auth.currentCompanyValue;
      }
      
      this.companiesLoaded = true;
    }, error => {
      this.companiesLoaded = true;
      // this._snackBar.open('Something went wrong','', {duration: 5000, panelClass: ['snackbar_danger']});
    })
  }

  companySwitch(identifier: any) {
    this.companiesLoaded = false
    this.company = this.auth.companiesList.find(items => items.identifier == identifier)
    this.auth.changeCompany(this.company);
    const url = this.router.url
    this.router.navigateByUrl('/app', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/app']);
      if (url != '/app') {
        this._snackBar.open('"Success! You have switched to ' + this.company.name + '. Redirecting you to the homepage."', '', { duration: 5000, panelClass: ['snackbar_success'] });
      }
    });
    setTimeout(() => {
      this.companiesLoaded = true
    }, 100);
  }

  logout() {
    this.auth.postAPI('logout/',{}).subscribe(responce => {
      this.auth.logout()
    }, error => {
      this._snackBar.open('Error in logout', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    })
  }

  demoRequest() {
    // let addDialog = this.dialog.open(RequestDemoComponent, {
    //   panelClass: 'custom-popup',
    //   width: "30%",
    //   data: {
    //     title: "Request Demo",
    //   }
    // });
    // addDialog.afterClosed().subscribe(responce => {
    //   if (responce) {
    //     this.auth.postAPI('agency/demo/', responce).subscribe(responce => {
    //       this._snackBar.open('Request for demo submitted successfully ', '', { duration: 5000, panelClass: ['snackbar_success'] });
    //     }, error => {
    //       this._snackBar.open('Error in scheduling demo', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    //     })
    //   }

    // })
  }

  // supportDialog(type:any) {
  //   let addDialog = this.dialog.open(SupportFormComponent, {
  //     panelClass: 'custom-popup',
  //     width: "35%",
  //     data: {
  //       title: type=="support"?"Support":"Send Feedback",
  //       type:type
  //     }
  //   });
  //   addDialog.afterClosed().subscribe(responce => {
  //     if (responce) {
  //         let msg = "Feedback Sent successfully "
  //         if(type=="support"){
  //           msg = "Request for support Sent successfully "
  //         }
  //         this._snackBar.open(msg, '', { duration: 5000, panelClass: ['snackbar_success'] });
  //     }
  //   })
  // }

  updateChecks(notifyId: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedIds.push(notifyId)
      this.selectedIds = _.uniq(this.selectedIds)
    }
    else {
      this.selectedIds = this.selectedIds.filter(item => (item != notifyId))
    }
  }

  notifyRedirection(data: any, type: string) {
    let idsArr = this.selectedIds
    let params: any = {
      ids: this.selectedIds,
      all: this.notifications.length == this.selectedIds.length,
      read: true
    }
    if (type == "single") {
      let Path: any
      if (data?.slug?.initiator || data?.slug?.reciever) {
        let slug = this.profile.identifier == data?.slug?.initiator ? data?.slug?.reciever : data?.slug?.initiator
        Path = this.pushNotification.getPathForSection(data?.ntype, 'core', slug);
      } else {
        Path = this.pushNotification.getPathForSection(data?.ntype, 'core', data?.slug);
      }
      this.auth.patchAPI(`notifications/${data.id}/`, { 'read': true }).subscribe({
        next: (result => {
          data.read = result.read
          if (Path) {
            this.router.navigate([Path]);
          }
          if (this.notifyCount) {
            this.notifyCount--
          }
          this.close('close')
        }), error: error => {
          this._snackBar.open('Error in reading notification', '', { duration: 5000, panelClass: ['snackbar_danger'] });
        }
      })

    }
    else if (type == "archive") {
      params.archive = true
      this.auth.postAPI(`bulk-read-notifications/`, params).subscribe({
        next: (result => {
          this.close('close')
          if (params.all) {
            this.notifications = []
            this.notifyCount = 0
          } else {
            this.notifications = this.notifications.filter(item => !idsArr.includes(item.id));
            this.notifyCount = this.notifications.filter(item => item.read === false).length
          }
        }), error: error => {
          this._snackBar.open('Error in reading notifications', '', { duration: 5000, panelClass: ['snackbar_danger'] });
        }
      })

    }
    else {
      params.archive = false
      this.auth.postAPI(`bulk-read-notifications/`, params).subscribe({
        next: (result => {
          this.close('close')
          this.notifyCount = 0
          this.notifications = this.notifications.map(item => {
            if (idsArr.includes(item.id)) {
              return { ...item, read: true };
            } else {
              if (!item.read) {
                this.notifyCount++;
              }
              return item;
            }
          });
        }), error: error => {
          this._snackBar.open('Error in reading notifications', '', { duration: 5000, panelClass: ['snackbar_danger'] });
        }
      })
    }
    this.selectedIds = []
  }

  toggleSelectAll(event: any) {
    const isChecked = event.checked;
    this.notifications.forEach(item => {
      this.updateChecks(item.id, isChecked)
    })
  }
  fullScreenToggle() {
    const isiOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    if (window.matchMedia("(max-width: 768px)").matches && !isiOS) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        this.fullScreen = false
      } else {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
          this.fullScreen = true
        }
      }
    } else {
      this._snackBar.open('Fullscreen mode is supported only on non-iOS mobile devices.', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    }
  }
  
  closeSidenavAndNavigate(): void {
    this.sidenav.close().then(() => {
      this.router.navigate(['/app/notifications']);
    });
  }
}
