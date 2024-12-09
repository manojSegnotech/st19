import { Routes } from '@angular/router';
import { UniversalComponent } from './universal.component';
import { HomeComponent } from './home/home.component';
// blogRoutes
export const routes: Routes = [
        {path:'',component:UniversalComponent,children:[
            {path: 'blog',loadChildren: () =>import('./blogs/blogs.routes').then((m) => m.routes)},
            {path:'',component:HomeComponent},
        ]
    }
];