import { Injectable, signal } from '@angular/core';

// The Web Speech API is not standard and may have vendor prefixes.
// We declare it here to satisfy TypeScript.
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  isListening = signal(false);
  transcript = signal<string>('');
  error = signal<string | null>(null);

  private recognition: any | null = null;

  constructor() {
    try {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = 'tr-TR';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening.set(true);
        this.error.set(null);
        this.transcript.set('');
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.transcript.set(transcript);
      };

      this.recognition.onerror = (event: any) => {
        let errorMessage = 'Bir şeyler ters gitti.';
        if (event.error === 'no-speech') {
            errorMessage = 'Ses algılanamadı.';
        } else if (event.error === 'audio-capture') {
            errorMessage = 'Mikrofon bulunamadı.';
        } else if (event.error === 'not-allowed') {
            errorMessage = 'Mikrofon izni verilmedi.';
        }
        this.error.set(errorMessage);
      };

      this.recognition.onend = () => {
        this.isListening.set(false);
      };

    } catch (e) {
      console.error('Speech Recognition API is not supported in this browser.', e);
      this.recognition = null;
    }
  }

  start(): void {
    if (this.recognition && !this.isListening()) {
      this.recognition.start();
    } else if (!this.recognition) {
        this.error.set('Konuşma tanıma desteklenmiyor.');
    }
  }

  stop(): void {
    if (this.recognition && this.isListening()) {
      this.recognition.stop();
    }
  }
}
