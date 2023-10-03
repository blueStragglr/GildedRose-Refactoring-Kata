export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  public items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  // - 하루가 지날때마다, 시스템은 두 값(`SellIn`, `Quality`)을 *1* 씩 감소시킵니다.
  // - 판매하는 나머지 일수가 없어지면, `Quality` 값은 **2배**로 떨어집니다.
  private _updateNormalItem(item: Item) {
    if (item.sellIn === 0) {
      item.quality -= 2
    } else {
      item.quality -= 1
      item.sellIn -= 1
    }
    item.quality = Math.max(0, item.quality)
  }

  // "**Aged Brie**"(오래된 브리치즈)은(는) 시간이 지날수록 `Quality` 값이 올라갑니다.
  private _updateAgedBrie(item: Item) {
    item.quality += 1
    item.sellIn -= 1
    item.quality = Math.min(50, item.quality)
  }

  // `SellIn` 값이 0에 가까워 질수록 `Quality` 값이 상승하고,
  // 10일 전 부터는 매일 2 씩 증가하다
  // 5일 전이 되면 매일 3 씩 증가하지만,
  // 콘서트 종료 후에는 0으로 떨어집니다.
  private _updateBackstagePasses(item: Item) {
    if (item.sellIn === 0) {
      item.quality = 0
    } else if (item.sellIn <= 5) {
      item.quality += 3
    } else if (item.sellIn <= 10) {
      item.quality += 2
    } else {
      item.quality += 1
    }
    item.sellIn -= 1
    item.sellIn = Math.max(0, item.sellIn)
    item.quality = Math.min(50, item.quality)
  }

  private _updateConjuredItem(item: Item) {
    if (item.sellIn === 0) {
      item.quality -= 4
    } else {
      item.quality -= 2
      item.sellIn -= 1
    }
    item.quality = Math.max(0, item.quality)
  }

  updateQuality() {
    this.items.forEach(item => {
      if (item.name === 'Aged Brie') {
        this._updateAgedBrie(item)
      } else if (item.name === 'Backstage passes to a TAFKAL80ETC concert') {
        this._updateBackstagePasses(item)
      } else if (item.name === 'Sulfuras, Hand of Ragnaros') {
        // - `Sulfuras`는 전설의 아이템이므로, 반드시 판매될 필요도 없고 `Quality` 값도 떨어지지 않습니다.
        console.info( Math.random() > 0.5 ? 'DIE, INSECTS' : 'BY FIRE BE PURGED!')
      } else if (item.name.match(/^Conjured.*/)) {
        this._updateConjuredItem(item)
      } else {
        this._updateNormalItem(item)
      }
    })

    return this.items;
  }
}
