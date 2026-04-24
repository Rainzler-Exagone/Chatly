export type ConversationParticipantCreation = {
  conversationId: string;
  userId: string;
};

export type ConversationResponse = {
  id: string;
  title: string;
  participants: {
    userId: string;
    User: {
      id: string;
      name: string;
      avatar?: string;
    };
  }[];
};