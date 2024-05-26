import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {PrismaClient} from "@prisma/client";
import {CheckAuthorityDto, GetRoomDto} from "~/data/dto";


const prisma = new PrismaClient();

//INFO 방 만들기
//5자리 코드 생성
async function generateRandomCode(length: number){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
    }

    return result;
}

async function createRoom(title:string, description:string, code:string){
    return prisma.room.create({
        data: { title:title, description:description, code:code },
    });
}
//MemberRoom에 방 Id & 사용자 이메일 & master로 저장
export async function createMemberRoom(email:string, roomId:number, authority:string){
    return prisma.memberRoom.create({
        data: { email:email, roomId:roomId, authority:authority },
    });
}

async function makeRoom(body:GetRoomDto){
    try{
        const randomCode = await generateRandomCode(5);
        //저장된 방 정보
        const room = await createRoom(body.title, body.description, randomCode);
        await createMemberRoom(body.email, room.roomId, "master");
        return  {state:"Success"}
    }catch (err){
        console.log(err)
        return  {state:err}
    }
}

//INFO 사용자 email로 참여하고 있는 방 정보 가져오기
async function getRoomInfoAll(email:string){
    const memberRooms = await prisma.memberRoom.findMany({
        where: {
            email: email
        },
        include: {
            room: true // Room 정보를 포함하여 가져옴
        }
    });
    //Room 정보만 추출
    const rooms = memberRooms.map(memberRoom => memberRoom.room);
    return rooms;
}

//INFO 방 id별로 방 정보 보여주기
async function getRoomInfoDetail(roomId:number){
    const roomDetail = await prisma.room.findUnique({
        where: {
            roomId: roomId
        },
        include:{
            members : {
                    include : {
                        user : true
                    }
            }
        }
    });

    if (!roomDetail) {
        return {state : 'no room'};
    }

    const roomDetailInfo = {
        roomId: roomDetail.roomId,
        title: roomDetail.title,
        description: roomDetail.description,
        code: roomDetail.code,
        members: roomDetail.members.map(member => ({
            email: member.email,
            nickname: member.user.nickname
        })),
        master : roomDetail.members
            .filter(member => member.authority === 'master')
            .map(member => member.user.nickname[0] || '')
    };

    return roomDetailInfo;
}

//INFO 코드입력하면 방에 들어가기
async function enterRoomWithCode(email:string, roomId:number, code:string) {
    try{
        const roomData = await prisma.room.findUnique({
            where: {
                roomId: roomId
            }
        })

        // 방이 없음 에러
        if (!roomData) {
            return { state: 'Room not found' };
        }
        const roomCode = roomData.code;

        if(roomCode === code){
            await prisma.memberRoom.create({
                data: { email:email, roomId:roomId, authority:'normal'},
            });
            return {state : 'Success'}
        }else{
            return {state : 'Invalid Code'}
        }
    }catch(err){
        return {state : err}
    }
}

//INFO 권한 체크하기
//권한 가져오기
async function getAuthority(email:string, roomId:number){
    return prisma.memberRoom.findUnique({
        where : {
            email_roomId:{
                email : email,
                roomId : roomId
            },
        },
        select : {
            authority : true
        }
    })
}

async function checkAuthority(body:CheckAuthorityDto){
    try{
        const email = body.email;
        const roomId = Number(body.roomId);

        const userAuthority = getAuthority(email, roomId);

        if (!userAuthority) {
            // 예외 처리: 값이 없을 경우
            throw new Error('Matched data not found');
        }

        return {state : userAuthority}

    }catch(err){
        return {state : 'Invalid email, roomId, or both'}
    }
}

//TODO 방정보 변경하기
// async function changeRoomInfo(body:RoomChangeDto){
//     try{
//         const email = body.email;
//         const title = body.title;
//         const description = body.description;
//         const roomId = Number(body.roomId);
//
//         const userAuthority = getAuthority(email, roomId);
//
//         if (!userAuthority) {
//             // 예외 처리: 값이 없을 경우
//             throw new Error('Matched data not found');
//         }
//
//         console.log(userAuthority)
//         if(userAuthority. === 'master'){
//             await prisma.room.update({
//                 where :{
//                     roomId : roomId
//                 },
//                 data : {
//                     title : title,
//                     description : description
//                 }
//             })
//
//             return {state : 'Success'}
//         }else{
//             return {state : 'Not a master'}
//         }
//     }catch(err){
//         return {state : err}
//     }
// }
//TODO 권한 변경하기
//TODO 방 나가기



export const loader:LoaderFunction = async ({request}) => {
    const loaderUrl = new URL(request.url);
    const email = loaderUrl.searchParams.get('email') || '';
    const type = loaderUrl.searchParams.get('type') || '';
    const roomId = Number(loaderUrl.searchParams.get('roomId')) || 0;
    switch(type){
        case 'all':
            return await getRoomInfoAll(email);
        case 'detail':
            return await getRoomInfoDetail(roomId);
        case 'authority' :
            // TODO 여기부터 고쳐!!!
            return await checkAuthority(email, roomId)
        default:
            return {state : 'Invalid Type'}
    }
}


export const action:ActionFunction = async ({request}) => {
    const body = await request.json();
    const type = body.type;
    const email = body.email;
    const roomId = Number(body.roomId);
    const code = body.code;
    switch(type){
        case 'makeRoom':
            //방 만들기
            return await makeRoom(body);
        case 'enter':
            //방 들어가기
            return await enterRoomWithCode(email, roomId, code);
        // case 'update':
            //방 정보
            // return await checkAuthority(body);
        default:
            return {state : 'Invalid Type'}
    }
}