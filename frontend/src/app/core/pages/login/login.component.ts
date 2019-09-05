import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services';
import { Router } from '@angular/router';
import { AlertService } from '../../../theme/components/alerts/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public form: FormGroup;
    
    public email: AbstractControl;
    
    public password: AbstractControl;

    public error: string;

    constructor(private fb: FormBuilder,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])]
        });

        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
    }

    ngOnInit() {
        if (this.authenticationService.isLogin()) {
            this.router.navigate(['/home']);
        } else {
            this.authenticationService.logout();
        }
    }

    public goNewUser(): void {
        this.router.navigate(['/register']);
    }

    public login(): void {
        const credentials = this.form.value;
        if (this.form.valid) {

            this.authenticationService.login(credentials.email, credentials.password)
                .subscribe(
                    response => {
                        if (response.status === 'OK') {
                            this.router.navigate(['/home']);
                        } else {
                            this.error = 'Algo salió mal. Por favor intente de nuevo.';
                        }
                    },
                    err => {
                        let resolved = false;

                        switch (err.status) {
                            case 401:
                                resolved = true;
                                this.error = 'Usuario o contraseña invalidos.';
                                break;
                            case 403:
                                resolved = true;
                                this.error = err.error.message;
                        }

                        if (!resolved && err.hasOwnProperty('error')) {
                            if (err.hasOwnProperty('error') && err.error !== null && err.error.hasOwnProperty('msg')) {
                                this.error = err.error.msg;
                                resolved = true;
                            }
                        }

                        if (!resolved) {
                            Object.keys(err).forEach((fieldName) => {
                                if (this.form.controls[fieldName]) {
                                    this.form.controls[fieldName].setErrors({backend: err[fieldName]});
                                    resolved = true;
                                }
                            });
                        }

                        if (!resolved) {
                            this.error = 'Se produjo un error al intentar conectarse al servidor.';
                        }
                    }
                );
        }
    }
}
