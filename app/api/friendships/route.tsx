import clientPromise from "../../../lib/mongodb";

export async function GET(request: Request): Promise<Response> {
  try {
    const client = await clientPromise;
    const friends = await client
    .db("nextjs-fullstack")
    .collection("friends")
    .find()
    .toArray();
    return new Response(JSON.stringify(friends));
  } catch(error: any) {
    return new Response(error);
  }
  
  
  
}
