import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TtsService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    // Voices might load asynchronously.
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices;
    }
  }

  private loadVoices = (): void => {
    this.voices = this.synth.getVoices();
  }

  speak(text: string): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    if (text && text.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
      };
      
      // Try to find a Turkish voice
      let turkishVoice = this.voices.find(voice => voice.lang === 'tr-TR');
      if (!turkishVoice) {
         // Fallback to the first voice that supports Turkish, if any
         turkishVoice = this.voices.find(voice => voice.lang.startsWith('tr'));
      }

      if (turkishVoice) {
        utterance.voice = turkishVoice;
      }
      
      utterance.lang = 'tr-TR';
      utterance.pitch = 1;
      utterance.rate = 0.9;
      this.synth.speak(utterance);
    }
  }
}
