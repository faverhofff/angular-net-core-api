
function validatorRut(rut, el, type) {
    if (rut.length > 0) {
        rut = rut.replace(/[.-]/g, '');
        rut = rut.replace(/[k]/g, 'K');
        rut = rut.replace(/[x]/g, 'X');
        const rutArr = rut.match(/./g);
        const validatorDigit = rutArr[rutArr.length - 1];

        let valid = true;
        if (validatorDigit !== 'X' && validatorDigit !== 'x') {
            let rutSum = 0;
            const serie = [2, 3, 4, 5, 6, 7];
            let seriePos = 0;
            for (let i = rutArr.length - 2; i >= 0; i--) {
                rutSum += rutArr[i] * serie[seriePos++];
                if (seriePos === serie.length) {
                    seriePos = 0;
                }
            }

            const rutMod = rutSum % 11; // Modulo 11
            let calculatedValidationDigit = 11 - rutMod;

            switch (calculatedValidationDigit) {
                case 10:
                    calculatedValidationDigit = 'K';
                    if (validatorDigit !== calculatedValidationDigit) {
                        el.addClass('ng-invalid');
                        el.parent().find('ng.invalid-feedback span').html(`D&iacute;gito verificador incorrecto.`);
                        valid = false;
                    } else {
                        el.removeClass('ng-invalid');
                        valid = true;
                    }
                    break;
                case 11:
                    calculatedValidationDigit = 0;
                default:
                    if (validatorDigit * 1 !== calculatedValidationDigit) {
                        el.addClass('ng-invalid');
                        el.parent().find('.invalid-feedback span').html(`D&iacute;gito verificador incorrecto.`);
                        valid = false;
                    } else {
                        el.removeClass('ng-invalid');
                        valid = true;
                    }
            }
        } else {
            valid = true;
        }

        const isValid = el.hasClass('ng-invalid') && valid && validatorDigit !== 'X' && validatorDigit !== 'x';
        if (isValid) {
            el.removeClass('ng-invalid');
        }

        return valid;
    }

    // el.parent().find('.invalid-feedback span').html('Este campo es obligatorio.');
    return false;
}

function formatRut(rut) {
    let r = rut.match(/./g);
    let formatted = false;

    switch (r.length) {
        case 8:
            formatted = `${r[0]}.${r[1]}${r[2]}${r[3]}.${r[4]}${r[5]}${r[6]}-${r[7]}`;
            break;
        case 9:
            formatted = `${r[0]}${r[1]}.${r[2]}${r[3]}${r[4]}.${r[5]}${r[6]}${r[7]}-${r[8]}`;
            break;
        case 10:
            formatted = `${r[0]}${r[1]}${r[2]}.${r[3]}${r[4]}${r[5]}.${r[6]}${r[7]}${r[8]}-${r[9]}`;
            break;
    }

    return formatted;
}


