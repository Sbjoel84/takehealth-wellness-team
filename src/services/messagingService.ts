import { apiRequest } from "./api";

export const messagingService = {
  async getConversations() {
    return apiRequest("/api/messaging/conversations");
  },

  async getMessages(conversationId: string, cursor?: string) {
    const q = cursor ? `?cursor=${cursor}` : "";
    return apiRequest(`/api/messaging/conversations/${conversationId}/messages${q}`);
  },

  async sendMessage(conversationId: string, content: string) {
    return apiRequest(
      `/api/messaging/conversations/${conversationId}/messages`,
      "POST",
      { content }
    );
  },

  async getUnreadCount() {
    return apiRequest("/api/messaging/unread");
  },
};

export default messagingService;
