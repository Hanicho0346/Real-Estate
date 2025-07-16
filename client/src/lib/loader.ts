import apiRequest from "./apiRequest"
export const singleloader = async ({ params }) => {
  const res = await apiRequest.get("/post/" + params.id)
  return { post: res.data }; 
}
export const listpageloader = async ({ request, params }) => {
  const query = request.url.split("?")[1] || "";
  const res = await apiRequest.get("/post/posts" + query);
  
return { post: res.data }; 
};
