import Swal, {SweetAlertOptions} from "sweetalert2";
import {ModalDialogOptions} from "../interfaces/modal-dialog-options";

export function showDeleteModalDialog(options: ModalDialogOptions = {}) {
    const defaultOptions = Object.assign({}, {
        title: 'Eliminar :titleSubject',
        text: '¿Está seguro que desea eliminar :textSubject?',
    }, options as SweetAlertOptions);

    showModalDialog(defaultOptions);
}

export function showModalDialog(options: ModalDialogOptions = {}) {
    const defaultOptions = {
        title: '',
        text: '',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        customClass: {
            popup: 'swal-deletion',
            confirmButton: 'btn btn-blue outline-box-none',
            cancelButton: 'btn btn-white mr-2 outline-box-none',
        },
    };

    let onFullfilled = function(response) {};
    let onRejected = function(response) {};

    Object.assign(defaultOptions, options);

    if (options.titleSubject) {
        defaultOptions.title = defaultOptions.title.replace(':titleSubject', options.titleSubject);
    } else {
        defaultOptions.title = defaultOptions.title.replace(':titleSubject', '');
    }

    if (options.textSubject) {
        defaultOptions.text = defaultOptions.text.replace(':textSubject', options.textSubject);
    } else {
        defaultOptions.text = defaultOptions.text.replace(':textSubject', '');
    }

    if (options.onFullfilled) {
        onFullfilled = options.onFullfilled;
    }

    if (options.onRejected) {
        onRejected = options.onRejected;
    }

    //Sweet alert complains on extra properties not set on it. So we take them away
    for (let prop of ['titleSubject', 'textSubject', 'onFullfilled', 'onRejected']) {
        if (defaultOptions.hasOwnProperty(prop)) {
            delete defaultOptions[prop];
        }
    }

    Swal.fire(defaultOptions).then(
        onFullfilled,
        onRejected
    )
}