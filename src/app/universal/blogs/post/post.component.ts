import { Component } from '@angular/core';

import { Validators, FormBuilder } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { BasicModule } from '../../../shared/modules/basic/basic.module';
import { LoginFormComponent } from '../../../shared/dialogs/login-form/login-form.component';
import { ShareComponent } from '../../../shared/dialogs/default/share/share.component';
import { AuthenticationService } from '../../../service/authentication.service';
import { MetaService } from '../../../service/meta.service';
import { SchemaDataService } from '../../../service/schema-data.service';
import { SkeletonComponent } from "../../../shared/common/skeleton/skeleton.component";
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-post',
  imports: [BasicModule, SkeletonComponent,NgxEditorModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  postdetail:any
  profileData:any = null;
  recentPosts:any=[]
  categories:any=[]
  comments:any=[]
  tags:any=[]
  openform=false;
  commentText='Leave a Comment'
  replyTo:any=null;
  showReply:any=null;
  currentUrl:any
  postSlug=''
  userAction:any
  api:any='blogs/posts/'
  page:any ='blog'
  commentForm:any
  replyForm:any  
  editor: Editor | undefined;
  html = '';

  get inf() { return this.commentForm.controls; }

  constructor(private location: Location, private dialog: MatDialog,private title:Title, private meta:Meta, private route:ActivatedRoute, public auth: AuthenticationService,private fb: FormBuilder,private metaService:MetaService,private schemaDataService: SchemaDataService){
    let pathname=this.location.path()
    if(pathname.includes('khabar/')){
      this.api='khabar/news/'
      this.page = 'khabar'
    }
    this.route.params.pipe().subscribe(params => {
      this.postSlug=params['slug']
      this.getPostDetail()
      this.currentUrl=this.auth.document.location.origin+'/'+this.page+'/'+this.postSlug
    });
    this.getRecentPosts()
    this.getCategories()
    this.getTags()
    this.profileData= auth.userValue.id ? auth.userValue : null;
    this.commentForm=this.fb.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,12}$')]],
      mobile:['', [Validators.required, Validators.min(6000000000), Validators.max(9999999999)]],
      content:['', Validators.required],
      website:['',[Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      user:[null],
      post:[null],
      parent:[null],
      status:['Inactive']
    })
    this.replyForm=this.fb.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,12}$')]],
      mobile:['', [Validators.required, Validators.min(6000000000), Validators.max(9999999999)]],
      content:['', Validators.required],
      website:['',[Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      user:[null],
      post:[null],
      parent:[null],
      status:['Inactive']
    })
    if(this.profileData){
      this.commentForm.patchValue({user:this.profileData.id})
    }
  }
 

  ngOnDestroy(): void {
    this.title.setTitle("Security Troops");
    this.metaService.removeMetaTags();
    this.schemaDataService.removeScript()
    if (this.editor) {
      this.editor.destroy();
    }
  }

  ngOnInit(): void {
    this.editor = new Editor();
    if(this.profileData){
      const userData:any={
        name: this.profileData.display,
        email: this.auth.decodeSecret(this.profileData.email),
        mobile: this.auth.decodeSecret(this.profileData.mobile),
      }
      this.clearForm()
      this.commentForm.patchValue(userData);
      this.replyForm.patchValue(userData);
    }
  }
  clearForm(){
    this.commentForm.get('website').clearValidators();
    this.commentForm.get('website').updateValueAndValidity();
    this.commentForm.get('mobile').clearValidators();
    this.commentForm.get('mobile').updateValueAndValidity();
    this.commentForm.get('email').clearValidators();
    this.commentForm.get('email').updateValueAndValidity();
    this.replyForm.get('website').clearValidators();
    this.replyForm.get('website').updateValueAndValidity();
    this.replyForm.get('mobile').clearValidators();
    this.replyForm.get('mobile').updateValueAndValidity();
    this.replyForm.get('email').clearValidators();
    this.replyForm.get('email').updateValueAndValidity();
  }

  // onSubmit(){
  //   this.commentForm.value.post = this.postdetail.id
  //   this.auth.postAPI('blogs/comment/',this.commentForm.value).subscribe(res=>{
  //     if(res){
  //       this.getPostDetail()
  //       this.replyTo=null
  //     }
  //   })
  // }

  getPostDetail(){
    this.auth.getAPI(`${this.api}${this.postSlug}/`).subscribe(result => {
      this.postdetail = result;
      let tSchema ='blogPost'
      if(this.page=='khabar'){
        tSchema ='newsDetails'
      }
      this.schemaDataService.generateJsonLdScripts(this.postdetail,tSchema)
      this.title.setTitle(this.postdetail['title']+" | Security Troops");
      let tags=this.postdetail?.tags?.map((item:any)=>item.title)
      this.metaService.setMetaTags(this.postdetail?.meta_title,this.postdetail?.meta_description,this.postdetail?.thumbnail || this.postdetail?.image ,tags)
      if(this.postdetail){
        this.userAction = this.postdetail?.actions?.find((items: { user: any; })=>items.user==this.profileData?.id)
        this.commentForm?.patchValue({post:this.postdetail.id})
      }
      this.comments=this.postdetail.comments
      // this.meta.addTags([{name: 'keywords',content:'Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping',},
      // {name: 'description', content:'We provide all kind of Security Services like Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping'}]);
    })
  }

  getCategories(){
    let api = 'blogs/categories/'
    if(this.page == 'khabar'){
      api = 'khabar/category/'
    }
    this.auth.getAPI(api).subscribe(result => {
      this.categories=result['results'];
      this.categories = this.categories.sort((a:any,b:any)=>(b?.posts - a?.posts))
    })
  }

  getTags(){
    let api = 'blogs/tags/'
    if(this.page == 'khabar'){
      api = 'khabar/tag/'
    }
    this.auth.getAPI(api).subscribe(result => {
      this.tags=result['results'];
      this.tags = this.tags.sort((a:any,b:any)=>(b?.posts - a?.posts))
    })
  }

  getRecentPosts(){
    this.auth.getAPI(`${this.api}`,{limit:6}).subscribe(result => {
      this.recentPosts=result['results'].filter((items: { slug: string; })=>(items?.slug != this.postSlug));
    })
  }

  PostAction(action:any,type:string){
    let arr:any={'post':this.postdetail?.id,'user':this.profileData?.id}
    let api = 'blogs/action/'
    if(this.page == 'khabar'){
      api = 'khabar/action/'
    }
    if(type=='like'){
      arr.like = action
      if(action){
        this.postdetail.likes +=1
        arr.unlike= !action
        if (this.userAction?.unlike){
          this.postdetail.unlikes -=1
        }
      }else{
        this.postdetail.likes -=1
      }

    }else if (type=='unlike'){
      arr.unlike = action
      if(action){
        this.postdetail.unlikes +=1
        arr.like= !action
        if (this.userAction?.like){
          this.postdetail.likes -=1
        }
      }else{
        this.postdetail.unlikes -=1
      }  
    }else if(type=='favourite'){
      arr.favourite = action
      if(action){
        this.postdetail.favourites +=1
      }else{
        this.postdetail.favourites -=1
      }
    }

    if(this.userAction){
      this.auth.patchAPI(api+this.userAction['id']+'/',arr).subscribe(result=>{
        this.userAction = result
      })
    }
    else{
      this.auth.postAPI(api,arr).subscribe(result=>{
        this.userAction = result
      })
    }
  }

  reply(comment:any){
    this.replyTo=_.cloneDeep(comment)
  }
  
  viewReply(comment:any){
    if(comment.id == this.showReply?.id){
      this.showReply=null
    }
    else{
      this.showReply=_.cloneDeep(comment)
    }
  }

  postComment(comment:any=null){
    let formValue=this.commentForm.getRawValue()
    if(comment){
      this.replyForm.patchValue({parent:comment.id})
      this.replyForm.patchValue({post:this.postdetail.id})
      this.replyForm.patchValue({user:this.profileData.id})
      formValue=this.replyForm.getRawValue()
    }
    else{
      this.commentForm.patchValue({post:this.postdetail.id})
      this.commentForm.patchValue({parent:null})
      this.replyForm.patchValue({user:this.profileData.id})
      formValue=this.commentForm.getRawValue()
    }
    this.auth.postAPI('blogs/comment/',formValue).subscribe(res=>{
      if(res){
        let formData:any={
          parent:null,content:''
        }
        if(!this.profileData){
          formData.name=''
          formData.email=''
          formData.mobile=''
          formData.website=''
        }
        if(comment){
          this.replyTo=null
          this.replyForm.patchValue(
            formData
          )
        }
        else{
          this.commentForm.patchValue(
            formData
            )
        }
        this.replyForm.get('content').setErrors(null)
        this.commentForm.get('content').setErrors(null)
        this.getPostDetail()
      }
    })
  }

  getTagClass(i:number){
    switch(i%5){
      case 0:{
        return 'btn-outline-info text-info'
      }
      case 1:{
        return 'btn-outline-secondary text-secondary'
      }
      case 2:{
        return 'btn-outline-warning text-warning'
      }
      case 3:{
        return 'btn-outline-primary text-primary'
      }
      case 4:{
        return 'btn-outline-success text-success'
      }
      default:{
        return 'btn-outline-info text-info'
      }
    }
  }
  loginForm() {
    let addDialog =  this.dialog.open(LoginFormComponent, {
      panelClass: 'custom-popup',
      width: "30%",
      data: {
        title: "See more on Security Troops",
      }
    });
    addDialog.afterClosed().subscribe(responce => {
     if(responce){
      this.profileData = responce
     }
    })
  }
  shareDialog( title: any) {
		const dialogRef =  this.dialog.open(ShareComponent, {
			width: '35%',
			panelClass: 'custom-popup',
			data: {
				url: this.currentUrl,
				title: title,
        page: 'Blog'
			}
		});
	}
}
