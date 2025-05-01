import { Routes } from '@angular/router';
import { ApplicationModuleComponent } from './admin/application-module/application-module.component';
import { AssignCourseComponent } from './admin/configuration/assign-course/assign-course.component';
import { CourseCategoryComponent } from './admin/configuration/course-category/course-category.component';
import { CourseComponent } from './admin/configuration/course/course.component';

import { InstructorComponent } from './admin/configuration/instructor/instructor.component';
import { UsersComponent } from './admin/configuration/users/users.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { DepartmentComponent } from './admin/department/department.component';
import { DesignationComponent } from './admin/designation/designation.component';
import { EnrollComponent } from './admin/enroll/enroll.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { ManageModuleRoleComponent } from './admin/manage-module-role/manage-module-role.component';
import { ManagePermissionComponent } from './admin/manage-permission/manage-permission.component';
import { ManageRoleComponent } from './admin/manage-role/manage-role.component';
import { ManageUserRoleComponent } from './admin/manage-user-role/manage-user-role.component';
import { PermissionComponent } from './admin/permission/permission.component';
import { RoleComponent } from './admin/role/role.component';
import { authGuard } from './auth.guard';
import { HomeDemoOneComponent } from './demos/home-demo-one/home-demo-one.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { BlogDetailsPageComponent } from './pages/blog-details-page/blog-details-page.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { CourseDetailsPageComponent } from './pages/course-details-page/course-details-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TeamDetailsPageComponent } from './pages/team-details-page/team-details-page.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { TestPageComponent } from './test-page/test-page.component';

export const routes: Routes = [
    { path: '', component: HomeDemoOneComponent },
    // { path: 'index-2', component: HomeDemoTwoComponent },
    // { path: 'index-3', component: HomeDemoThreeComponent },
    { path: 'about', component: AboutPageComponent },
    // In your route configuration

    {
        path: 'courses',
        loadComponent: () =>
            import('../app/pages/courses-page/courses-page.component').then(
                (m) => m.CoursesPageComponent
            ),
        data: { ssr: false },
    }, // Disable SSR for this route if needed
    { path: 'course-details', component: CourseDetailsPageComponent },
    { path: 'team', component: TeamPageComponent },
    // { path: 'team-details', component: TeamDetailsPageComponent },
    { path: 'team-details/:id', component: TeamDetailsPageComponent },

    // { path: 'blog', component: BlogPageComponent },
    { path: 'blog-details', component: BlogDetailsPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'profile', component: ProfileComponent },
    // ... other routes
    { path: 'forgot-password', component: ForgotPasswordComponent },
    {
        path: 'reset-password', // Note: No parameters in the path
        component: ResetPasswordComponent,
    },
    // Optional: Redirect legacy API URLs if needed
    {
        path: 'api/applicationUser/resetPassword',
        redirectTo: 'reset-password',
        pathMatch: 'full',
    },
    {
        path: 'api/ApplicationUser/confirm-email',
        redirectTo: 'confirm-email',
        pathMatch: 'full',
    },
    {
        path: 'confirm-email',
        component: ConfirmEmailComponent,
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
    },
    { path: 'register', component: RegisterPageComponent },
    // { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    // { path: 'terms-conditions', component: TermsConditionsPageComponent },
    { path: 'contact', component: ContactPageComponent },
    { path: 'test', component: TestPageComponent },
    // Here add new pages component
    { path: 'profile', canActivate: [authGuard], component: ProfileComponent },
    // Admin routes
    {
        path: 'admin',
        component: LayoutComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'SuperAdmin', 'INSTRUCTOR'] },
        children: [
            {
                path: 'dashboard',
                component: AdminDashboardComponent,
                data: { permissions: ['View_COURSE'] },
            },

            {
                path: 'configuration',
                children: [
                    {
                        path: 'course-category',
                        component: CourseCategoryComponent,
                    },
                    {
                        path: 'enrolls',
                        component: EnrollComponent,
                        data: { permissions: ['View_COURSE'] },
                    },
                    {
                        path: 'manage-user-role/:id',
                        component: ManageUserRoleComponent,
                    },

                    {
                        path: 'subscribe',
                        loadComponent: () =>
                            import(
                                '../app/admin/subscribe/subscribe.component'
                            ).then((m) => m.SubscribeComponent),
                    },
                    {
                        path: 'contact-admin',
                        loadComponent: () =>
                            import(
                                '../app/admin/contact/contact.component'
                            ).then((m) => m.ContactComponent),
                    },
                    {
                        path: 'course',
                        component: CourseComponent,
                    },
                    {
                        path: 'instructor',
                        component: InstructorComponent,
                    },
                    {
                        path: 'assign-course',
                        component: AssignCourseComponent,
                    },

                    {
                        path: 'departments',
                        component: DepartmentComponent,
                    },
                    {
                        path: 'designations',
                        component: DesignationComponent,
                    },
                    {
                        path: 'roles',
                        component: RoleComponent,
                        data: { permissions: ['View_COURSE'] },
                    },
                    {
                        path: 'manage-role',
                        component: ManageRoleComponent,
                    },
                    {
                        path: 'manage-permission',
                        component: ManagePermissionComponent,
                    },
                    {
                        path: 'manage-role-module',
                        component: ManageModuleRoleComponent,
                    },
                    {
                        path: 'permissions',
                        component: PermissionComponent,
                    },
                    {
                        path: 'app-module',
                        component: ApplicationModuleComponent,
                    },
                    {
                        path: 'users',
                        component: UsersComponent,
                        data: { permissions: ['View_COURSE'] },
                    },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                ],
            },
        ],
    },

    { path: '**', component: ErrorPageComponent }, // This line will remain down from the whole pages component list
];
