import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

interface ChatMessage {
    author: 'user' | 'ai';
    content: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent {
  private geminiService = inject(GeminiService);
  
  isWindowOpen = signal(false);
  isLoading = signal(false);
  userInput = signal('');
  messages = signal<ChatMessage[]>([
    { author: 'ai', content: 'Merhaba! Ben Bilge Baykuş. Sana nasıl yardımcı olabilirim? Bir konuyu mu merak ettin, yoksa sadece sohbet mi etmek istersin? 🦉' }
  ]);
  
  @ViewChild('messageContainer') private messageContainer: ElementRef | undefined;

  constructor() {
      // Auto-scroll when new messages are added
      effect(() => {
          if (this.messages() && this.isWindowOpen()) {
              setTimeout(() => this.scrollToBottom(), 0);
          }
      });
  }

  toggleChatWindow(): void {
    this.isWindowOpen.update(value => !value);
    if (this.isWindowOpen()) {
      // When opening the chat, ensure a session is started
      this.geminiService.startChatSession();
    } else {
      // Optional: reset session when closing to clear history on the backend
      this.geminiService.resetChatSession();
    }
  }

  async sendMessage(): Promise<void> {
    const userMessage = this.userInput().trim();
    if (!userMessage || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.messages.update(msgs => [...msgs, { author: 'user', content: userMessage }]);
    this.userInput.set('');

    // Add a placeholder for the AI response for streaming
    this.messages.update(msgs => [...msgs, { author: 'ai', content: '' }]);

    try {
      const stream = this.geminiService.sendMessageStream(userMessage);
      for await (const chunk of stream) {
        // Update the last AI message with the new chunk
        this.messages.update(msgs => {
          const lastMessage = msgs[msgs.length - 1];
          if (lastMessage && lastMessage.author === 'ai') {
            lastMessage.content += chunk;
          }
          return [...msgs];
        });
      }
    } catch (error) {
      console.error('Chatbot send message error:', error);
      this.messages.update(msgs => {
        const lastMessage = msgs[msgs.length - 1];
        if (lastMessage && lastMessage.author === 'ai') {
            lastMessage.content = 'Üzgünüm, bir hata oluştu. Lütfen tekrar dene.';
        } else { // In case the error happened before the placeholder was added
            msgs.push({ author: 'ai', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar dene.' });
        }
        return [...msgs];
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer?.nativeElement) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}
