import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services';
import { Router } from '@angular/router';
import { AlertService } from '../../../theme/components/alerts/alert.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    public form: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    public repassword: AbstractControl;

    public error: string;

    constructor(private fb: FormBuilder,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])],
            'repassword': ['', Validators.compose([Validators.required])]
        });

        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
        this.repassword = this.form.controls['repassword'];
    }

    ngOnInit() {
        if (this.authenticationService.isLogin()) {
            this.router.navigate(['/home']);
        }
    }

    public goLogin(): void {
        this.router.navigate(['/login']);
    }

    public create(): void {
        const credentials = this.form.value;
        if (this.form.valid) {
            this.authenticationService.register(credentials.email, credentials.password)
                .subscribe( (response) => {
                    if (response.succeeded === true) {
                        this.authenticationService.login(credentials.email, credentials.password).subscribe( () => {
                            this.router.navigate(['/home']);
                        });
                    } else {
                        if (response.errors.length > 0)
                            this.error = response.errors[0]['description'];
                        else 
                            this.error = 'Algo salió mal. Por favor intente de nuevo.';
                    }
                });
        }
    }
}
