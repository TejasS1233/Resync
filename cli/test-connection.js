import axios from "axios";

const API_URL = "https://resync-pvu5.onrender.com/api";

async function testConnection() {
  console.log("Testing connection to:", API_URL);
  console.log("");

  try {
    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log("✓ Health check passed:", healthResponse.data);
    console.log("");

    // Test login endpoint with dummy data
    console.log(
      "2. Testing login endpoint (should fail with invalid credentials)..."
    );
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: "test@test.com",
        password: "wrongpassword",
      });
    } catch (error) {
      if (error.response) {
        console.log(
          "✓ Login endpoint responding:",
          error.response.status,
          error.response.data
        );
      } else {
        console.log("✗ Connection error:", error.message);
      }
    }
    console.log("");

    console.log("Connection test complete!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Run: resync config set-url");
    console.log("2. Select: Production");
    console.log("3. Run: resync auth login");
  } catch (error) {
    console.error("✗ Connection failed:", error.message);
    if (error.code === "ENOTFOUND") {
      console.error("Server not found. Check the URL.");
    } else if (error.code === "ETIMEDOUT") {
      console.error("Connection timed out. Server might be starting up.");
    }
  }
}

testConnection();
