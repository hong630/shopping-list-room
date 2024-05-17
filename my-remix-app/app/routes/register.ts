/*TODO member 테이블에  email,nickname,password 저장 */
import {json, LoaderFunction} from "@remix-run/node";

export const getTest = () => {
        return json({content:'hello GETETEEEEEEEEEEEEEEEEEEEEET'});
}

export const loader:LoaderFunction = () => {
        return getTest()
}

export const postTest = (body:{content:string}) => {

        return json({content:body.content});
}

export const action:LoaderFunction = async (param) => {
        const body = await param.request.json();

        // body가 올바른 타입인지 확인
        if (typeof body.content !== 'string') {
                return json({ error: "Invalid content type" }, { status: 400 });
        }

        return postTest(body)
}




// create-user

// read user

// update user

// delete user
