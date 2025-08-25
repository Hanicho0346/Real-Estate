
import apiRequest from "./apiRequest"

export const singleloader = async ({ params }) => {
  const res = await apiRequest.get("/post/" + params.id)
  return { post: res.data }; 
}
export const listPageLoader = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  const validParams = new URLSearchParams();

  const allowedParams = [
    'type',
    'location',
    'propertyType',
    'priceRange',
    'bedroom',
    'bathroom',
    'minPrice',
    'maxPrice'
  ];

  allowedParams.forEach(param => {
    const value = searchParams.get(param);
    if (value) {
      validParams.set(param, value);
    }
  });
  
  const apiUrl = `/post/posts${validParams.toString() ? `?${validParams.toString()}` : ''}`;
  
  try {
    const res = await apiRequest.get(apiUrl);
    return { post: res.data };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { post: [] };
  }
};
export const profilepageLoader = async () => {
  try {
    const [profileResponse, chatsResponse] = await Promise.all([
      apiRequest.get("/user/profile"),
      apiRequest.get("/chats")
    ]);

        console.log("profile response",profileResponse.data)
    return { 
      user: profileResponse.data.user,
      userPosts: profileResponse.data.userPosts || [],  
      savedPosts: profileResponse.data.savedPosts || [], 
      chats: chatsResponse.data || []
    };

  } catch (err:any) {
    console.error("Profile loader error:", err);
    throw new Response(JSON.stringify({ 
      message: err.response?.data?.message || "Failed to load profile data",
      details: err.response?.data?.details
    }), {
      status: err.response?.status || 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
