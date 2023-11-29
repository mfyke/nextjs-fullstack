import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";


export async function GET(request: Request): Promise<Response> {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if(session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const friends = await client
    .db("nextjs-fullstack")
    .collection("friendships")
    .find({ $or: [{ sender: new ObjectId(session.user.id) }, { receiver: new ObjectId(session.user.id) }] })
    .toArray();
    return new Response(JSON.stringify(friends));
  } catch(error: any) {
    return new Response(error);
  }
  
}

export async function POST(request: Request): Promise<Response> {
  try{
    const session = await getServerSession({ req: request, ...authOptions });

    if(session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const client = await clientPromise;

    if(body.email === undefined) { 
      return new Response("Email is required", { status: 400 });
    }

    const friend = await client
      .db("nextjs-fullstack")
      .collection("users")
      .findOne({ email: body.email })
    
    if(friend === null) {
      return new Response("User not found", { status: 404 });
    }

    if(friend._id.equals(new ObjectId(session.user.id))) {
      return new Response("You cannot be friends with yourself", { status: 400 });
    }

    const existingFriendship = await client
      .db("nextjs-fullstack")
      .collection("friendships")
      .find({ $or: [{ sender: new ObjectId(session.user.id), receiver: friend._id }, { sender: friend._id, receiver: new ObjectId(session.user.id) }] })
      .toArray()

    if(existingFriendship.length > 0) {
      return new Response("Friendship already exists", { status: 400 });
    }

    const friendship = await client
      .db("nextjs-fullstack")
      .collection("friendships")
      .insertOne({ sender: new ObjectId(session.user.id), receiver: friend._id, accepted: false })

    return new Response(JSON.stringify(friendship));
  } catch(error: any) {
    return new Response(error);
  }

}
