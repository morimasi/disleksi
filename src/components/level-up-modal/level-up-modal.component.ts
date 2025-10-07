import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Badge, AvatarItem, AvatarItemCategory } from '../../models/gamification.model';

@Component({
  selector: 'app-level-up-modal',
  templateUrl: './level-up-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelUpModalComponent {
  level = input.required<number>();
  rewards = input.required<(Badge | AvatarItem)[]>();
  close = output<void>();

  confettiPieces = signal<{left: string, animDelay: string, animDuration: string, color: string}[]>([]);

  categoryNames: Record<AvatarItemCategory, string> = {
    head: 'Şapka',
    eyes: 'Gözlük',
    neck: 'Boyun Aksesuarı',
    accessory: 'Ekstra'
  };

  constructor() {
    this.generateConfetti();
  }

  isAvatarItem(reward: Badge | AvatarItem): reward is AvatarItem {
      return 'category' in reward;
  }

  private generateConfetti(): void {
    const pieces = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    for (let i = 0; i < 150; i++) {
        pieces.push({
            left: `${Math.random() * 100}%`,
            animDelay: `${Math.random() * 5}s`,
            animDuration: `${4 + Math.random() * 3}s`,
            color: colors[i % colors.length]
        });
    }
    this.confettiPieces.set(pieces);
  }

  handleClose(): void {
    this.close.emit();
  }
}
