import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map } from 'rxjs/operators';

export interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
}

@Component({
    selector: 'app-material-dashboard',
    standalone: true,
    imports: [
        AsyncPipe,
        MatGridListModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './material-dashboard.component.html',
    styleUrl: './material-dashboard.component.scss',
})
export class MaterialDashboardComponent {
    private breakpointObserver = inject(BreakpointObserver);

    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({ matches }) => {
            if (matches) {
                return [
                    { title: 'Statistics', cols: 2, rows: 1 },
                    { title: 'Recent Activity', cols: 2, rows: 1 },
                    { title: 'User Table', cols: 2, rows: 2 },
                ];
            }

            return [
                { title: 'Statistics', cols: 2, rows: 1 },
                { title: 'Recent Activity', cols: 1, rows: 1 },
                { title: 'User Table', cols: 1, rows: 2 },
            ];
        })
    );

    // Table setup
    displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor() {
        // Create mock data
        const users = Array.from({ length: 50 }, (_, k) =>
            createNewUser(k + 1)
        );
        this.dataSource = new MatTableDataSource(users);
        console.log(this.dataSource);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}

/** Creates mock user data */
function createNewUser(id: number): UserData {
    const roles = ['Admin', 'Editor', 'Viewer', 'User'];
    const statuses = ['Active', 'Pending', 'Inactive'];

    return {
        id: id.toString(),
        name: `User ${id}`,
        email: `user${id}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
    };
}
