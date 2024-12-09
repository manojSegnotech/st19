import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';import { BasicModule } from '../../../shared/modules/basic/basic.module';
import { AuthenticationService } from '../../../service/authentication.service';

@Component({
  selector: 'app-tag',
  imports: [BasicModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {

  tags:any[]=[]
  api:any='blogs/tags/'
  page:any ='blog'
  constructor(private location: Location,private title: Title, private auth: AuthenticationService) {
		this.title.setTitle("Tags | Security Troops");
    let pathname=this.location.path()
    if(pathname.includes('khabar/')){
      this.api='khabar/tag/'
      this.page = 'khabar'
    }
	}
  ngOnInit(): void {
    this.getTags()
  }
  ngOnDestroy(): void {
    this.title.setTitle("Security Troops");
  }
  
  getTags() {
		this.auth.getAPI(`${this.api}`).subscribe(result => {
			this.tags = result['results'];
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


}
