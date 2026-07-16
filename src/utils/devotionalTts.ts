/**
 * Devotional TTS Utility for Bhagavad Gita Reading
 * Provides peaceful, slow, spiritual voice synthesis for verses and meanings
 */

interface DevotionalTtsOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

class DevotionalTts {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;

  /**
   * Stop current speech synthesis
   */
  stop(): void {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Check if currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Speak Sanskrit shloka with devotional tone
   * Pauses after sentences and danda (।) for meditation effect
   */
  async speakShloka(
    text: string,
    onComplete?: () => void,
    options?: DevotionalTtsOptions
  ): Promise<void> {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    this.stop();
    this.isPlaying = true;

    const defaultOptions: DevotionalTtsOptions = {
      rate: 0.75, // Slow, meditative pace
      pitch: 1.0,
      volume: 1.0,
      lang: 'sa-IN', // Sanskrit
      ...options,
    };

    // Split shloka by lines for pauses between lines
    const lines = text.split('\n').filter((line) => line.trim());

    try {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by danda (।) and sentence ends for natural pauses
        const parts = this.splitBySentenceEnds(line);

        for (let j = 0; j < parts.length; j++) {
          const part = parts[j].trim();
          if (!part) continue;

          await this.speakPart(
            part,
            defaultOptions,
            j === parts.length - 1 && i === lines.length - 1
          );

          // Pause between parts (after danda or sentences)
          if (j < parts.length - 1) {
            await this.pause(400); // 400ms pause after sentences
          }
        }

        // Pause between lines
        if (i < lines.length - 1) {
          await this.pause(600); // 600ms pause between shloka lines
        }
      }

      this.isPlaying = false;
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error in devotional TTS:', error);
      this.isPlaying = false;
      if (onComplete) onComplete();
    }
  }

  /**
   * Speak meaning (Hindi or English) with natural tone
   */
  async speakMeaning(
    text: string,
    language: 'hindi' | 'english',
    onComplete?: () => void,
    options?: DevotionalTtsOptions
  ): Promise<void> {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    this.stop();
    this.isPlaying = true;

    const defaultOptions: DevotionalTtsOptions = {
      rate: 0.8, // Slightly slower for clarity
      pitch: 1.0,
      volume: 1.0,
      lang: language === 'hindi' ? 'hi-IN' : 'en-US',
      ...options,
    };

    try {
      // Split by sentences for natural pauses
      const sentences = this.splitBySentences(text);

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (!sentence) continue;

        await this.speakPart(
          sentence,
          defaultOptions,
          i === sentences.length - 1
        );

        // Pause after each sentence
        if (i < sentences.length - 1) {
          await this.pause(500); // 500ms pause between sentences
        }
      }

      this.isPlaying = false;
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error in meaning TTS:', error);
      this.isPlaying = false;
      if (onComplete) onComplete();
    }
  }

  /**
   * Internal method to speak a single part
   */
  private speakPart(
    text: string,
    options: DevotionalTtsOptions,
    isLast: boolean
  ): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.75;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'sa-IN';

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        resolve();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Pause for specified milliseconds
   */
  private pause(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Split shloka by danda (।) and sentence ends
   */
  private splitBySentenceEnds(text: string): string[] {
    // Split by danda (।) or period
    const parts = text.split(/[।।.!?]/);
    return parts.filter((part) => part.trim().length > 0);
  }

  /**
   * Split meaning text by sentence boundaries
   */
  private splitBySentences(text: string): string[] {
    // Split by period, exclamation mark, question mark
    const sentences = text.split(/[।।.!?\n]/);
    return sentences.filter((sent) => sent.trim().length > 0);
  }
}

// Export singleton instance
export const devotionalTts = new DevotionalTts();
