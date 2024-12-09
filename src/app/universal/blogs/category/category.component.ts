import { Component } from '@angular/core';
import { AuthenticationService } from '../../../service/authentication.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { BasicModule } from '../../../shared/modules/basic/basic.module';

@Component({
  selector: 'app-category',
  imports: [BasicModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  categories:any[]=[]
  api:any='blogs/categories/'
  page:any ='blog'
  constructor(private location: Location,private title: Title, private auth: AuthenticationService) {
		this.title.setTitle("Categories | Security Troops");
    let pathname=this.location.path()
    if(pathname.includes('khabar/')){
      this.api='khabar/category/'
      this.page = 'khabar'
    }

	}
  ngOnInit(): void {
    this.getCategories()
  }
  ngOnDestroy(): void {
    this.title.setTitle("Security Troops");
  }
  
  getCategories() {
		this.auth.getAPI(`${this.api}`).subscribe(result => {
			this.categories = result['results'];
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
