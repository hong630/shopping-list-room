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

export interface GetRoomDto {
    email:string,
    title:string,
    description:string
}

//INFO 룸

export interface RoomDto {
    roomId : number,
    title:string,
    description:string
}

//INFO 룸 상세
export interface RoomDetailMembersDto{
    email : string,
    nickname : string
}
export interface RoomDetailDto {
    code : string,
    description : string,
    master : Array<string>,
    members : Array<RoomDetailMembersDto>,
    roomId : number,
    title : string
}

//INFO 방정보 변경하기
export interface RoomChangeDto {
    email : string,
    title : string,
    description : string,
    roomId : number
}

//INFO 권한 체크하기
export interface CheckAuthorityDto {
    email : string,
    roomId : number;
}