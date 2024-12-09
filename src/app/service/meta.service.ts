// meta.service.ts
import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private meta:Meta){}

  setMetaTags(title: string, description: string, image: string='',keywords:string[]=['Bodyguard', 'Bouncer', 'Home Guard', 'Gunman', 'Watchman', 'Valet', 'Field Officer', 'Supervisor', 'Housekeeping']) {
    // Create and set meta tags
    this.createMetaTag('title', title);
    this.createMetaTag('description', description);
    this.createMetaTag('og:title', title,'property');
    this.createMetaTag('og:description', description,'property');
    if(image){
      this.createMetaTag('og:image', image,'property');
    }
    this.createMetaTag('twitter:card', 'summary_large_image');
    this.createMetaTag('twitter:image', image);
    this.createMetaTag('keywords',  keywords?.join(', '));
  }

  removeMetaTags() {
    this.removeMetaTag('title');
    this.removeMetaTag('description');
    this.removeMetaTag('og:title','property');
    this.removeMetaTag('og:description','property');
    this.removeMetaTag('og:image','property');
    this.removeMetaTag('twitter:card');
    this.removeMetaTag('twitter:image');
    this.removeMetaTag('keywords');
  }

  private createMetaTag(name: string, content: string,key='name') {
    let data:any={}
    data[key]=name
    this.meta.addTag({ ...data, content });
  }

  private removeMetaTag(name: string,key='name') {
    this.meta.removeTag(`${key}="${name}"`);
  }
}
