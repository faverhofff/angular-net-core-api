import { User } from '../models/user';

export class TransformService {

    /**
     * 
     * @param formValues 
     */
    public transformPostDate(formValues: User): User | null {
        if (formValues.PostDate) {
            let pDate = formValues.PostDate['date'];
            formValues.PostDate = `${pDate.day}/${pDate.month}/${pDate.year}`;
        } else 
            formValues.PostDate = '';

        return formValues;
    }

    /**
     * 
     * @param row 
     */
    public transformRowKeys(row: any) {
        return Object.keys(row)
        .reduce((destination, key) => {
            let Key = this.capitalizeFirstLetter(key);
            destination[Key] = row[key];
            return destination;
        }, {});
    }

    /**
     * 
     * @param string 
     */
    public capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}