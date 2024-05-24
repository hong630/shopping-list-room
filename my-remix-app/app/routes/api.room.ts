import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {PrismaClient} from "@prisma/client";
import {GetRoomDto} from "~/data/dto";


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

export const action:ActionFunction = async ({request}) => {
    const body = await request.json();
    return await makeRoom(body);
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
            memberRooms : {
                    include : {
                        user : true
                    }
            }
        }
    });

    if (!roomDetail) {
        return null; // 방 정보를 찾지 못한 경우 null 반환
    }

    return roomDetail;
}


export const loader:LoaderFunction = async ({request}) => {
    const loaderUrl = new URL(request.url);
    const email = loaderUrl.searchParams.get('email') || '';
    const type = loaderUrl.searchParams.get('type') || '';
    const roomId = Number(loaderUrl.searchParams.get('roomId')) || 0;
    switch(type){
        case 'all':
            return await getRoomInfoAll(email);
        case 'detail':
            return await getRoomInfoDetail(roomId)
        default:
            return {state : 'getting room info error'}
    }

}



