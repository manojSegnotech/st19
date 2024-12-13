import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'app',
    loadChildren: () =>
        import('./core/core.routes').then((m) => m.routes),
    },
    {
    path: '',
    loadChildren: () =>
        import('./universal/universal.routes').then((m) => m.routes),
    },
];
