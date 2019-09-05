
export class User {
    constructor(public Id: number = -1,
                public Name: string = '',
                public LastName: string = '',
                public Years: number = 0,
                public PostDate: string = '',
                public Position: string = '',
                public Email: string = '',
                public Password: string = '',
                public SecurityStamp: string = '') {
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