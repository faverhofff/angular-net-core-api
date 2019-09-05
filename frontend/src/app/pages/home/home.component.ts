import { Component, HostListener, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ButtonsRendererComponent } from 'src/app/ui/datatable/renderers/buttons.renderer.component';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { DatatableNetComponent } from 'src/app/ui/datatable/datatable.net.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/theme/services';
import { IMyDpOptions } from 'mydatepicker';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/core/models/user';
import { TransformService } from 'src/app/core/services/transform.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
  providers: [
    UserService
  ]
})

export class HomeComponent {

  /** @type {FormGroup} accountForm user form instance */
  public accountForm: FormGroup;

  /** @type {DatatableNetComponent} datatable user datatable instance  */
  @ViewChild('datatable') public datatable: DatatableNetComponent;

  /** @type {SwalComponent} modal windows instance for user edition */
  @ViewChild('EditionBox') public EditionBox: SwalComponent;
  
  /** @type {ElementRef} */
  @ViewChild("fileInput") fileInput: ElementRef;

  /**
   * Date picker init date configuration.
   *
   * @type {IMyDpOptions}
   */
  OptionsDP: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy'
  };
  
  /** @tableSettings */
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

  /** @error */
  public error = "";

  constructor(
    public userService: UserService,
    protected fb: FormBuilder,
    protected zone: NgZone,
    protected http: HttpClient,
    protected transformSerice: TransformService,
    protected loadingService: LoadingService
    ) {     
      this.createForm();
  }

  /**
   * 
   * @param target 
   */
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


  /**
   * 
   */
  public newUser(): void {
    this.prepareForm();
    this.EditionBox.show();
  }

  /**
   * 
   * @param $target 
   */
  private getDataTableRowData($target): any {
    const datatable = $target.parents('table').DataTable()
    const $row = $target.parents('tr')
    return datatable.row($row).data()
  }

  /**
   * 
   * @param row 
   */
  public prepareForm(row: User = new User()) {
    let values = this.transformSerice.transformRowKeys(row);
    this.accountForm.reset();
    this.accountForm.patchValue(values);
  }

  public CloseModal(): void {
    this.EditionBox.nativeSwal.close();
  }

  public saveOnCloseModal(): void {
    this.loadingService.start();
    const formValues = this.transformSerice.transformPostDate( this.accountForm.getRawValue() );

    this.userService.save(formValues)
      .pipe(
        finalize( () => {
          this.loadingService.stop();
        })
      )
      .subscribe( (result) => {
          if (result.status === 'OK') {
            if (!formValues.Id)
              this.uploadFile(this.fileInput.nativeElement.files);

            this.finalizeUserCreate();
          }
          else 
            this.error = result.status.length > 0 ? result.status[0].description : '';
      });
  }


  /**
   * 
   */
  private finalizeUserCreate(): void {
    this.error = "";
    this.EditionBox.nativeSwal.close();
    this.datatable.reload()
  }

  /**
   * 
   */
  protected createForm(): void {
    this.accountForm = this.fb.group({
        Email: ['', Validators.compose([
          Validators.required
        ])],
        Name: ['', Validators.compose([
          Validators.required
        ])],
        Password: ['', Validators.compose([
          Validators.minLength(2)
        ])],
        LastName: [false],
        Years:  ['', Validators.compose([
          Validators.maxLength(2)
        ])],
        PostDate: [false],
        Position:  ['', Validators.compose([
          Validators.maxLength(255)
        ])],
        Id: [false],
        SecurityStamp: [false]
    });
  }

  /**
   * 
   * @param files 
   */
  public uploadFile(file): void {
    if (!file)
      return;

    let idUser = this.accountForm.controls.id.value;
    this.userService.upload(idUser, file.files);
  }


}
