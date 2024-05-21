export interface USERDATA {
    email: string,
    nickname: string,
    belong: Array<string>,
    authority: Array<UserDataAuthority>
}

export interface UserDataAuthority{
    id: string,
    role: string
}

export interface MEMBER {
    email: string,
    nickname: string
}

export interface SHOPPINGLIST {
    name: string,
    shopped: boolean
}

export interface ROOMDETAILDATA {
    id:string,
    myShoppingRoom:string,
    detail:string,
    members:Array<MEMBER>,
    invitationLink:string,
    shoppingList:Array<SHOPPINGLIST>,
    authority:string
}

// INFO 로그인 세션
export interface User {
    id: number;
    email: string;
    nickname: string;
}

export interface LoggedInUserData {
    user: User | null;
    isLoggedIn: boolean;
}

