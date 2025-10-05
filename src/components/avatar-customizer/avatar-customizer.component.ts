import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { AvatarItem, AvatarItemCategory } from '../../models/gamification.model';
import { ALL_AVATAR_ITEMS } from '../../gamification.data';

interface CustomizationItem extends AvatarItem {
  isUnlocked: boolean;
  isEquipped: boolean;
}

@Component({
  selector: 'app-avatar-customizer',
  templateUrl: './avatar-customizer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarCustomizerComponent {
  unlockedItemIds = input.required<string[]>();
  equippedItemIds = input.required<string[]>();

  close = output<void>();
  save = output<string[]>();

  // This signal will hold the state of equipped items during customization
  tempEquippedIds = signal<string[]>([]);
  
  constructor() {
    effect(() => {
        // This effect runs whenever the input signal changes, keeping the temporary state in sync.
        this.tempEquippedIds.set(this.equippedItemIds()); 
    });
  }

  // A computed signal to prepare all items for display
  customizationItems = computed<CustomizationItem[]>(() => {
    const unlockedIds = this.unlockedItemIds();
    const equippedIds = this.tempEquippedIds();
    return ALL_AVATAR_ITEMS.map(item => ({
      ...item,
      isUnlocked: unlockedIds.includes(item.id),
      isEquipped: equippedIds.includes(item.id),
    }));
  });

  // A computed signal to group items by category for the UI
  itemsByCategory = computed(() => {
    const items = this.customizationItems();
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<AvatarItemCategory, CustomizationItem[]>);
  });
  
  categoryNames: Record<AvatarItemCategory, string> = {
    head: 'Şapkalar',
    eyes: 'Gözlükler',
    neck: 'Aksesuarlar',
    accessory: 'Ekstralar'
  };
  
  categoryOrder: AvatarItemCategory[] = ['head', 'eyes', 'neck', 'accessory'];
  
  avatarWithEquippedItems = computed(() => {
     return this.customizationItems().filter(item => item.isEquipped);
  });

  toggleItem(item: CustomizationItem): void {
    if (!item.isUnlocked) return;

    this.tempEquippedIds.update(ids => {
      let newIds = [...ids];
      const itemCategory = item.category;
      
      // Find if an item of the same category is already equipped
      const equippedInCategory = this.customizationItems().find(i => i.category === itemCategory && i.isEquipped);

      if (item.isEquipped) {
        // Unequip the item
        newIds = newIds.filter(id => id !== item.id);
      } else {
        // Unequip any other item in the same category
        if (equippedInCategory) {
          newIds = newIds.filter(id => id !== equippedInCategory.id);
        }
        // Equip the new item
        newIds.push(item.id);
      }
      return newIds;
    });
  }

  handleSave(): void {
    this.save.emit(this.tempEquippedIds());
    this.close.emit();
  }

  handleClose(): void {
    this.close.emit();
  }
}