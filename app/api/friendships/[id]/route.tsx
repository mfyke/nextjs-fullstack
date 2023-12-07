import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from "mongodb";

export async function PATCH(request: Request, context: { params: Params } ): Promise<Response> { 
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if(session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const friendship = await client
      .db("nextjs-fullstack")
      .collection("friendships")
      .findOne({ _id: new ObjectId(context.params.id) });

    if(friendship === null) {
      return new Response("Friendship not found", { status: 404 });
    }

    if(!friendship.sender.equals(new ObjectId(session.user.id)) && !friendship.receiver.equals(new ObjectId(session.user.id))) {
      return new Response("You can only update your own friendships", { status: 403 });
    }

    const body = await request.json();
    const updateResult = await client
      .db("nextjs-fullstack")
      .collection("friendships")
      .updateOne({ _id: new ObjectId(context.params.id) }, { $set: { accepted: body.accepted } });

    return new Response(JSON.stringify(updateResult), { status: 200 });
  } catch(error: any) {
    return new Response(error);
  }
}

export async function DELETE(request: Request, context: { params: Params } ): Promise<Response> {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if(session === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const friendship = await client
      .db("nextjs-fullstack")
      .collection("friendships")
      .findOne({ _id: new ObjectId(context.params.id) });

    if(friendship === null) {
      return new Response("Friendship not found", { status: 404 });
    }

    if(!friendship.sender.equals(new ObjectId(session.user.id)) && !friendship.receiver.equals(new ObjectId(session.user.id))) {
      return new Response("You can only delete your own friendships", { status: 403 });
    }

    const deleteResult = await client
      .db("nextjs-fullstack")
      .collection("friendships")
      .deleteOne({ _id: new ObjectId(context.params.id) });

    return new Response(JSON.stringify(deleteResult), { status: 200 });
  } catch(error: any) {
    return new Response(error);
  }
}
