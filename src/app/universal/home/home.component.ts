import { Component, OnInit, ViewChild, Input,ViewEncapsulation,QueryList ,ViewChildren} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
// import { ApplicationFormComponent } from 'src/app/shared/dialogs/agency/application-form/application-form.component'
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
// import { RequestDemoComponent } from 'src/app/shared/dialogs/request-demo/request-demo.component';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { LoginFormComponent } from 'src/app/shared/dialogs/login-form/login-form.component';
import { error } from 'node:console';
import { AuthenticationService } from '../../service/authentication.service';
import { BasicModule } from '../../shared/modules/basic/basic.module';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  imports: [BasicModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @Input() index: number = 1;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChildren(MatSelect) matSelects!: QueryList<MatSelect>;
  dataSet:any=[];
  FaqSet:any=[];
  services:any = [];
  jobs:any=[];
  tableData: any[]=[];
  jobtypes: string[]=['All','FullTime','PartTime','Temporary'];
  citys: any[] = ['All'];
  jobType: any[]=  ['All'];
  selectedCompany:any
  // serviceTitle: any=[];
  // jobProfession:any=[];
  // jobCard:any=[];
  // directions = new Set<string>(jobType);
  selectedIndex=0;
  defaultValue = "All";
  empFilters:any[]=[];
	filterDictionary= new Map<string,string>();
  companies:any=[]
  isShow = false;
  todayDate:any;
  selected:any;
  companies_faq:any=[]
  over:any=[]
  rating: any
  starCount: number = 5;
  color: string = 'accent';
  ratingArr: string[] = [];
  comRating:any=[];
  chunkedRate: any[][] = [];
  activeIndex: number = 0; 
  loginUser:any
  userNumber:any
  posts:any[]=[]

  dataSource = new MatTableDataSource<any>(this.tableData);

  constructor( private datePipe:DatePipe ,private title:Title, private meta:Meta,private dialog:MatDialog,public auth: AuthenticationService,private router: Router,private _snackBar: MatSnackBar, ){
    this.selectedCompany = auth.currentCompanyValue
    this.loginUser = auth.userValue?.id ? auth.userValue : null
    this.todayDate = this.datePipe.transform(this.selected, 'MM-dd')
    this.title.setTitle("Home | Security Troops");
    this.meta.addTags([{name: 'keywords',content:'Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping',},{name: 'description', content:'We provide all kind of Security Services like Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping'}])
    this.meta.addTag({author:'Vijay jakhar'})

    // this.auth.getAPI('company-public/').subscribe(result => {
    //   this.companies=result['results'];
    // })

    this.auth.getAPI(`faqs/`).subscribe((result:any) => {
      this.companies_faq=result['results'];
      this.FaqChange({textLabel:'Agencies'})
    })
    this.jobDetails()
    this.serviceDetails()
    this.getRating()
    this.getPosts()
    // this.over = new Array(this.services.length);
    // this.over.fill(false);
  }

  ngOnChanges(): void {
    
  }
  ngOnInit(): void {
    this.empFilters.push({name:'jobtype',options:this.jobtypes,defaultValue:this.defaultValue,lable:'Job Type'});
    this.empFilters.push({name:'title',options:this.jobType,defaultValue:this.defaultValue,lable:'Title'});
    for (let indexx = 0; indexx < this.starCount; indexx++) {
      this.ratingArr.push('indexx');
    }
  }

  selectSlide(index: number): void {
    this.activeIndex = index;
  }
  onSubmit() {
    const queryParams:any = {};
    this.matSelects.forEach((matSelect, index) => {
      const empfilter = this.empFilters[index];
      const value = matSelect.value;
      
      if (value !== null && value !== undefined) {
        queryParams[empfilter.name] = value;
      }
    });
    this.router.navigate(['/jobs'], { queryParams });
  }
  userForm(){
    if(this.loginUser){
      if(this.userNumber==this.auth.decodeSecret(this.loginUser?.mobile) || this.userNumber==this.auth.decodeSecret(this.loginUser?.email)){
        this._snackBar.open('You are already logged in with this mobile number/username', '', { duration: 5000, panelClass: ['snackbar_orange'] });
        this.router.navigate(['/app']);
      }else{
        this._snackBar.open(`You are already logged in ${this.loginUser?.display}.`, '', { duration: 5000, panelClass: ['snackbar_orange'] });
      }
    }
    else{
      this.auth.postAPI('otp-send/',{"username":this.userNumber}).subscribe({next:(response:any) => {
        const queryParams:any = {'forlogin':true,'email':this.auth.decodeSecret(response?.email),'user':response?.username};
        this.router.navigate(['/otp'], { queryParams });
      },error:(error:any)=>{
        if(error?.details){
          const queryParams:any = {'mobile':this.userNumber,'error':error?.details};
          this._snackBar.open(' Please sign up.', '', { duration: 5000, panelClass: ['snackbar_orange'] });
          this.router.navigate(['/signup'], { queryParams });
        }else{
          this._snackBar.open('Error while signing up. Please try again', '', { duration: 5000, panelClass: ['snackbar_danger'] });
        }
      }})
    }
  }

  ngAfterViewInit(): void {
  }
  loginForm() {
    // let addDialog =  this.dialog.open(LoginFormComponent, {
    //   panelClass: 'custom-popup',
    //   width: "35%",
    //   data: {
    //     title: "Sign in now for a free demo!",
    //   }
    // });
    // addDialog.afterClosed().subscribe(responce => {
    //   if(responce){
    //     this.loginUser = responce
    //    }
    // })
  }

  getRating(){
    this.auth.getAPI('agency/rating/').subscribe((result:any) => {
      this.comRating=result.results
      this.chunkedRate = this.chunkArray(this.comRating, 3); 
    })
  }
  getPosts(){
    this.auth.getAPI(`blogs/posts/?limit=4`).subscribe((result:any) => {
      this.posts=result.results
    })
  }

  serviceDetails(){
    this.auth.getAPI('service/').subscribe((result:any) => {
      this.services = result['results'];
      this.tabChange({'textLabel':'All Jobs'})
    })
  }

  jobDetails(){
    this.auth.getAPI('jobs/lists/?status=Active').subscribe(result => {
      this.jobs = result['results'];
      // this.dataSet =this.jobs.slice(0, 3);
      this.dataSource.data=this.jobs
      this.tabChange({textLabel:'All Jobs'})
      for(let i in this.jobs){
        this.jobType.push(this.jobs[i]['title'])
      }
      const newCity= new Set(this.jobs.map((item:any) => item?.cities?.name.toLowerCase()));
			this.citys = this.citys.concat(Array.from(newCity));
      this.empFilters.push({name:'city',options:this.citys,defaultValue:this.defaultValue,lable:'City'});
    })
  }

  applyEmpFilter(ob:any,empfilter:any) {
		this.filterDictionary.set(empfilter.name,ob.value);
		var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
		this.dataSource.filter = jsonString;
	}
  toggleDisplay() {  
    this.isShow = !this.isShow;  
  }  

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  tabChange(event:any){
    let service=event.textLabel
    if (service=='All Jobs'){
      this.dataSet =this.jobs.slice(0, 3);
    }else{
      this.dataSet=this.jobs.filter((item:any) => (item?.services?.title==service)).slice(0, 3);
    }
  }

  FaqChange(event:any){
    let data:any = {'Agencies':'Company','Professionals':'Professional','Clients':'Client'}
    let faq=data[event.textLabel]
    this.FaqSet=this.companies_faq.filter((item:any) => (item?.ftype==faq))
  }

  showIcon(indexx:number ,ratvalu:any) {
    this.rating=ratvalu
    if (this.rating >= indexx + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
 
  applicationFormDialog(job:any) {
    // const dialogRef = this.dialog.open(ApplicationFormComponent, {
    //   width: '35%',
    //   panelClass: 'custom-popup',
    //   data: {
    //     company: job?.companies?.name,
    //     title:  job?.title,
    //     city: job?.cities?.name,
    //     id: job?.id,
    //     service:job?.service,
    //     services:job?.services
    //   },
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.status) {
    //     job.applied=true
    //   }
    // })
  }

  chunkArray(array: any[], size: number): any[][] {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  demoRequest() {
    // let addDialog =  this.dialog.open(RequestDemoComponent, {
    //   panelClass: 'custom-popup',
    //   width: "30%",
    //   data: {
    //     title: "Request Demo",
    //   }
    // });
    // addDialog.afterClosed().subscribe(responce => {
    //   if (responce) {
    //     this.auth.postAPI('agency/demo/', responce).subscribe({next:(res) => {
    //       this._snackBar.open('Request for demo submitted successfully', '', { duration: 5000, panelClass: ['snackbar_success'] });
    //     }, error:error => {
    //       this._snackBar.open('Error in scheduling demo', '', { duration: 5000, panelClass: ['snackbar_danger'] });
    //     }})
    //   }
  
    // })
  }
}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
