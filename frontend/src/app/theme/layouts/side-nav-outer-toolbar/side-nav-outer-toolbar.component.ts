import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-side-nav-outer-toolbar',
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss']
})
export class SideNavOuterToolbarComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    private dispatchResizeEvent(): void {
        setTimeout(()=>{
            window.dispatchEvent(new Event('resize'));
        }, 400)
    }
}
