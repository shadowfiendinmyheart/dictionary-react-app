import { makeAutoObservable  } from "mobx";

const storageName = 'token';

class User {
    token: string = localStorage.getItem(storageName) || '';
    name: string = '';
    isAuth: boolean = false;
    
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

    async checkAuth() {
        if (!localStorage.getItem(storageName)) return;

        try {
            const check = await fetch('api/auth/refresh', {method: 'GET', headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }});

            if (!check.ok) {
                throw new Error('not auth');
            }
            this.setAuth(true);
        } catch (e) {
            console.log(e);
        }
    }

}

export default new User();