import {SweetAlertOptions} from "sweetalert2";

export interface ModalDialogOptions extends SweetAlertOptions {
    titleSubject?: string,
    textSubject?: string,
    onFullfilled?: (response: any) => void,
    onRejected?: (response: any) => void
}