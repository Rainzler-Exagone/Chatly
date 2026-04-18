type MessagePreviewInput = {
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
  content?: string;
};

export function buildLastMessagePreview(message: MessagePreviewInput) {
  switch (message.messageType) {
    case 'text':
      return (message.content ?? '').slice(0, 80);

    case 'image':
      return '📷 Photo';

    case 'video':
      return '🎥 Video';

    case 'audio':
      return '🎤 Voice message';

    case 'file':
      return '📎 Attachment';

    default:
      return 'New message';
  }
}
