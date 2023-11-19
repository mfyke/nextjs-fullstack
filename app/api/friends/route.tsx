export async function GET(request: Request): Promise<Response> {
  return new Response("GET request to /api/friends");
}
