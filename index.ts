import { McpServer, PromptCallback, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Human Messages Prompts",
  version: "1.0.0"
});
const generatePrompt = async (platform: string) => {
  return `Transform the message to a ${platform} message`;
};

// Add an addition tool
server.prompt("human-messages-prompts",
  "Generate a prompt for a human message",
  {
    platform: z.enum(["twitter", "discord", "telegram", "whatsapp", "email", "sms", "other"]),
    message: z.string().optional()
  },
  async ({ platform, message }) => {
    const prompt = await generatePrompt(platform);
    const messages = message ? [{
      role: "user" as const,
      content: { type: "text" as const, text: message }
    }] : [];
    return {
      messages: [
        { role: "assistant" as const, content: { type: "text" as const, text: prompt } },
        ...messages
      ]
    }
  } 
);


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);