import { makeAutoObservable  } from "mobx";

const storageName = 'token';

class User {
    token: string = localStorage.getItem(storageName) || '';
    name: string = '';
    isAuth: boolean = Boolean(this.token);
    
    constructor() {
        makeAutoObservable(this);
    }

    setToken(token: string) {
        this.token = token;
    }

    setName(name: string) {
        this.name = name;
    }

    setAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    login(token: string) {
        this.setToken(token);
        this.setAuth(true);

        localStorage.setItem(storageName, this.token);
    }

    logout() {
        this.setToken('');
        this.setAuth(false);

        localStorage.removeItem(storageName);
    }

    refresh(token: string) {
        this.setToken(token);

        localStorage.setItem(storageName, this.token);
    }

}

export default new User();