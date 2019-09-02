import { Component, HostListener, NgZone, ViewChild } from '@angular/core';
import { ButtonsRendererComponent } from 'src/app/ui/datatable/renderers/buttons.renderer.component';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { DatatableNetComponent } from 'src/app/ui/datatable/datatable.net.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { LoginForm } from 'src/app/core/models/login.form';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/theme/services';
import { IMyDpOptions } from 'mydatepicker';
import { HttpRequest, HttpEventType } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { empty } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
  providers: [
    UserService
  ]
})
export class HomeComponent {

  /**
   * Date picker period start configuration.
   *
   * @type {IMyDpOptions}
   */
  periodStartOptionsDP: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy'
  };
  
  public startInitDate: any;
  // public startInitDate: any = {date: {year: this.yearFilterValue, month: 1, day: 1}};

  /** */
  public accountDefinition: FormGroup;

  /** */
  public error = "";

  /** */
  @ViewChild('datatable') public datatable: DatatableNetComponent;

  /** */
  @ViewChild('EditionBox') public EditionBox: SwalComponent;
  
  /** */
  public tableSettings = {
    ajax: `${environment.urlApiLocation}User/List`,
    class: 'accounts',
    onUserRowSelect: false,
    searching: true,
    columns: [
        {title: 'Name', data: 'name'},
        {title: 'Last Name', data: 'lastName'},
        {title: 'Email', data: 'email'},
        {title: 'Years', data: 'years'},
        {title: 'Post Date', data: 'postDate'},
        {title: 'Position', data: 'position'},
        {
            title: '', className: 'text-right', 'orderable': false, 'searchable': false, width:"5",
            render: function (data, type, row, meta) {
                return ButtonsRendererComponent.formatValue(row, row.id, false, true, true, true);
            }
        }
    ]
  };

  constructor(
    protected fb: FormBuilder,
    protected userService: UserService,
    protected zone: NgZone,
    protected loadingService: LoadingService,
    protected http: HttpClient
    ) {     
      this.createForm();
  }

  @HostListener('click', ['$event.target'])
  public clickComponent(target: any): void {
      this.zone.runOutsideAngular(() => {
          this.zone.runOutsideAngular(
              () => {
                const $target = $(target);
                if ($target.hasClass('editElement')) {
                  const row = this.getDataTableRowData($target);

                  this.prepareForm(row);

                  this.EditionBox.show();
                }
                if ($target.hasClass('deleteElement')) {
                  this.userService.delete( $target.data('id') ).subscribe( () => {
                    this.datatable.reload();
                  })
                }                
          });
      });
  }  

  public newUser(): void {
    this.prepareForm();

    this.accountDefinition.controls.password.setValue('');

    this.EditionBox.show();
  }

  private getDataTableRowData($target): any {
    const datatable = $target.parents('table').DataTable()
    const $row = $target.parents('tr')
    return datatable.row($row).data()
  }

  private getForm()  {
    let date = this.accountDefinition.controls['postDate'].value;
    return {
      Email: this.accountDefinition.controls['email'].value,
      Name: this.accountDefinition.controls['name'].value,
      LastName: this.accountDefinition.controls['lastName'].value,
      Years: this.accountDefinition.controls['years'].value,
      PostDate: date ? date.formatted : '',
      Position: this.accountDefinition.controls['position'].value,
      Id: this.accountDefinition.controls['id'].value,
      SecurityStamp: this.accountDefinition.controls['securityStamp'].value,
      Password: this.accountDefinition.controls['password'].value
    };
  }

  public prepareForm(row: LoginForm = new LoginForm()) {
      this.accountDefinition.controls['email'].setValue(row.email);
      this.accountDefinition.controls['name'].setValue(row.name);
      this.accountDefinition.controls['lastName'].setValue(row.lastName);
      this.accountDefinition.controls['years'].setValue(row.years);
      this.accountDefinition.controls['postDate'].setValue( row.postDate );
      this.accountDefinition.controls['position'].setValue(row.position);
      this.accountDefinition.controls['id'].setValue(row.id);
      this.accountDefinition.controls['securityStamp'].setValue(row.securityStamp);
      this.accountDefinition.controls['password'].setValue('');
  }

  public CloseModal(): void {
    this.EditionBox.nativeSwal.close();
  }

  public saveOnCloseModal(): void {
    const formValues = this.getForm();
    this.loadingService.start();

    this.userService.save(formValues)
      .pipe(
        finalize( () => {
          this.loadingService.stop();
        })
      )
      .subscribe( (result) => {
          if (result.status === 'OK') {
            this.error = "";
            this.EditionBox.nativeSwal.close();
            this.datatable.reload()
          }
          else 
            this.error = result.status.length > 0 ? result.status[0].description : '';
      });
  }

  protected createForm(): void {
    // Validators.required
    this.accountDefinition = this.fb.group({
        email: [false],
        name: [false],
        lastName: [false],
        years: [false],
        postDate: [false],
        position: [false],
        id: [false],
        securityStamp: [false],
        password: [false]
    });
  }

  public upload(files) {
    if (files.length === 0 || empty(this.accountDefinition.controls['id'].value))
      return;

    const formData = new FormData();

    for (let file of files) {
      let fileName = this.accountDefinition.controls['id'].value;
      formData.append(fileName, file);
    }

    const uploadReq = new HttpRequest('POST', `${environment.urlApiLocation}User/Upload`, formData, {
      reportProgress: true,
    });

    this.http.request(uploadReq).subscribe(event => {
      
    });
  }

}
