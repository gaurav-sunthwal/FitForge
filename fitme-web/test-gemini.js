const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  console.log("Model initialized:", model.model);
}
run();
