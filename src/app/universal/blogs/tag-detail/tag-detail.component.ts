import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-detail',
  imports: [],
  templateUrl: './tag-detail.component.html',
  styleUrl: './tag-detail.component.scss'
})
export class TagDetailComponent {
  slug=''
  constructor(private route:ActivatedRoute){
    this.route.params.subscribe((params:any) => {
      this.slug = params.slug;
    });
  }
}
