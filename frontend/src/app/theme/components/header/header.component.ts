import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services';
import { User } from '../../../core/models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public user: User;

    constructor(private http: HttpClient,
                private router: Router,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.user = AuthenticationService.getUser();
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
