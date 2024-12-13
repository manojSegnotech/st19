import { Routes } from '@angular/router';
import { BlogsComponent } from './blogs.component';
import { PostComponent } from './post/post.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryComponent } from './category/category.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';
import { TagComponent } from './tag/tag.component';

export const routes: Routes = [
    { path: 'tag/:slug', component: TagDetailComponent },
    { path: 'category/:slug', component: CategoryDetailComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'tag', component: TagComponent },
    { path: ':slug', component: PostComponent },
    { path:'',component:BlogsComponent },
];