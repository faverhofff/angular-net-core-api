import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from './alert.service';

declare var $: any;

@Component({
    selector: 'app-alert',
    templateUrl: './alert.template.html',
    styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {

    // Message Type [success, info, warning, danger, purple]
    @Input() type = '';

    // Message Title
    @Input() title = '';

    // Message Content
    @Input() content = '';

    constructor(private alertService: AlertService) {
        this.alertService.ready.subscribe(
            data => {
                this.type = data.type;
                this.title = data.title;
                this.content = data.content;
                $('.alert').show();

                window.setTimeout(function () {
                    $('.alert').fadeTo(200, 0).slideUp(200, function () {
                        $(this).hide();
                        $(this).css('opacity', '1');
                    });
                }, 4000);
            });
    }

    public ngOnInit(): void {

        $('.alert .close').on('click', function () {
            $(this).parent().hide();
        });
        $('.alert').css('display', 'none');
    }

    public closeAlert() {
        this.type = '';
        this.title = '';
        this.content = '';
    }
}
