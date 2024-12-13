import { Routes } from '@angular/router';
import { FeedsComponent } from './feeds/feeds/feeds.component';
import { FeedComponent } from './feeds/feed/feed.component';
import { CoreComponent } from './core.component';

export const routes: Routes = [
    { path: 'feeds/hashtag/:hash', component: FeedsComponent },
    { path: 'feeds:slug', component: FeedComponent },
    { path:'feeds',component:FeedsComponent },
    { path:'',component:CoreComponent },
];