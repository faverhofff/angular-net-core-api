import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {NgxPermissionsService} from "ngx-permissions";
import {ModulesService} from "../../services/modules.service";
import {RolesService} from "../../services/roles.service";
import {User} from "../../../core/models/user";
import {AuthenticationService} from "../../../core/services";
import {CookieService} from "ngx-cookie-service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    isExpanded = true;
    @Output() isExpandedSidebar: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    
    }
}