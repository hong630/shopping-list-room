import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {PrismaClient} from "@prisma/client";
import {RoomDto} from "~/data/dto";


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

async function makeRoom(body:RoomDto){
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

async function getRoomInfo(email:string){
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

export const loader:LoaderFunction = async ({request}) => {
    const body = await request.json();
    return await getRoomInfo(body.email);
}

