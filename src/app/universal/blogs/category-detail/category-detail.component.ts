import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicModule } from '../../../shared/modules/basic/basic.module';
@Component({
  selector: 'app-category-detail',
  imports: [BasicModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss'
})
export class CategoryDetailComponent {
  slug=''
  constructor(private route:ActivatedRoute){
    this.route.params.subscribe((params:any) => {
      this.slug = params.slug;
    });
  }
}
