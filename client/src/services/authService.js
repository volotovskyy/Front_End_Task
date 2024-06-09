import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export const registerUser = async (email, password, username) => {
  try {
    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      username,
    });
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    return {
      ...authData,
      token: pb.authStore.token,
    };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
