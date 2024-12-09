import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {FormBuilder } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../service/authentication.service';
import { MetaService } from '../../service/meta.service';
import { SchemaDataService } from '../../service/schema-data.service';
import { BasicModule } from '../../shared/modules/basic/basic.module';
import { SkeletonComponent } from "../../shared/common/skeleton/skeleton.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { MultiKeyFilterPipe } from "../../pipes/custom/multi-key-filter.pipe";
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  imports: [BasicModule, SkeletonComponent, NgxPaginationModule, MultiKeyFilterPipe],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
  pageNumber=1
	loginUser:any;
	posts: any = [];
	tags: any = [];
	categories: any = [];
	postTitle: any;
	filterDictionary = new Map<any, string>();
	titles: any = [];
	currentUrl: any
	errors:any;
	showMore={
		cat:false,
		tags:false
	}
	searchQuery=''
	selectedParam:any
	loading = false
	@Input() slug = ''
	@Input() page = ''
	api:any='blogs/posts/'
	isPage:any ='blog'

	constructor(private location: Location,private fb: FormBuilder, private title: Title, private meta: Meta, private metaService: MetaService, private auth: AuthenticationService,private schemaDataService: SchemaDataService,private router: Router) {
		this.title.setTitle("Blog | Security Troops");
		// this.meta.addTags([{ keyword: 'Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping', },
		// { description: 'We provide all kind of Security Services like Bodyguard, Bouncer, Home Guard, Gunman, Watchman, Valet, Field Officer, Supervisor, Housekeeping' }]);
		let pathname=this.location.path()
		if(pathname.includes('khabar')){
		  this.api='khabar/news/'
		  this.isPage = 'khabar'
		}
    this.currentUrl = this.auth.document.location.href;
    console.log(this.currentUrl)
		this.loginUser = auth.userValue
		
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['slug']){
			this.getPosts()
			if(this.page=='Category'){
				this.metaService.removeMetaTags();
				this.selectedParam = this.categories.find((item:any)=> (item?.slug==this.slug))
				this.metaService.setMetaTags(this.selectedParam?.meta_title,this.selectedParam?.meta_description,'',[])
			}
			if(this.page=='Tag'){
				this.metaService.removeMetaTags();
				this.selectedParam = this.tags.find((item:any)=> (item?.slug==this.slug))
				this.metaService.setMetaTags(this.selectedParam?.meta_title,this.selectedParam?.meta_description,'',[])
			}
		}
	}

	ngOnDestroy(): void {
		this.title.setTitle("Security Troops");
		this.metaService.removeMetaTags();
		this.schemaDataService.removeScript()
	}

	ngOnInit(): void { 
		if(!this.slug){
			this.getPosts();
		}
		this.getCategories();
		this.getTags();
	}

	getPosts() {
		let params:any={}
		if(this.page=='Category'){
			params.category__slug=this.slug
		}
		if(this.page=='Tag'){
			params.tag__slug=this.slug
		}
		this.auth.loaderShow = false
		this.loading = true
		this.auth.getAPI(this.api,params).subscribe({
			next:result => {
				this.posts = result['results'];
				let tSchema = 'postList'
				if(this.isPage=='khabar'){
					tSchema = 'newsList'
				}
				this.schemaDataService.generateJsonLdScripts(this.posts,tSchema)
				for (let i in this.posts) {
					this.titles.push(this.posts[i]['title'])
				}
				this.loading =false
			},
			error:err=>{
				this.loading =false
			}
		})
	}

	getCategories(){
		this.auth.loaderShow = false
		let api = 'blogs/categories/'
		if(this.isPage == 'khabar'){
		  api = 'khabar/category/'
		}
		this.auth.getAPI(api).subscribe({
			next:result => {
				this.categories = result['results'];
				this.categories = this.categories.sort((a:any,b:any)=>(b?.posts - a?.posts))
				if(this.page=='Category'){
					this.selectedParam = this.categories.find((item:any)=> (item?.slug==this.slug))
					this.metaService.setMetaTags(this.selectedParam?.meta_title,this.selectedParam?.meta_description,'',[])
				}
			},
			error:err=>{}
		})
	}

	getTags(){
		this.auth.loaderShow = false
		let api = 'blogs/tags/'
		if(this.isPage == 'khabar'){
		  api = 'khabar/tag/'
		}
		this.auth.getAPI(api).subscribe({
			next:result => {
				this.tags = result['results'];
				this.tags = this.tags.sort((a:any,b:any)=>(b?.posts - a?.posts))
				if(this.page=='Tag'){
					this.selectedParam = this.tags.find((item:any)=> (item?.slug==this.slug))
					this.metaService.setMetaTags(this.selectedParam?.meta_title,this.selectedParam?.meta_description,'',[])
				}
			},
			error:err=>{}
		})
	}

}
