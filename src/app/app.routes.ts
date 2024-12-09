import { Routes } from '@angular/router';
// import { BlogsComponent } from './universal/blogs/blogs.component';
// import { UniversalComponent } from './universal/universal.component';

export const routes: Routes = [
    // {path:'',component:UniversalComponent,children:[
    //     {path:'',component:BlogsComponent}
    // ]},
    {
    path: '',
    loadChildren: () =>
        import('./universal/universal.routes').then((m) => m.routes),
    },
];
