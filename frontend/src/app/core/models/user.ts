
export class User {
    constructor(public id: number = -1,
                public name: string = '',
                public lastName: string = '',
                public years: number = 0,
                public postDate: string = '',
                public jobPost: string = '',
                public email: string = '',
                public password: string = '',
                public logoImageFile: string = '') {
    }

    /**
     * Make a User model
     *
     * @param {Partial<User>} data
     * @return {User}
     */
    static make(data?: Partial<User>): User {
        if (data) {
            return Object.assign(new this(), data);
        }
        return new this();
    }

}
