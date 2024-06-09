import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090"); // Adjust to your PocketBase URL

async function testAuth() {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword("test@test.com", "password"); // Replace with your test email and password
    console.log("Authenticated:", authData);
  } catch (e) {
    console.error("Authentication failed:", e);
  }
}

testAuth();
