import { Item, GildedRose } from '@/gilded-rose'

describe('Gilded Rose', () => {

  //  - 모든 아이템은 `SellIn` 값을 가지며, 이는 아이템을 판매해야하는 (남은) 기간을 나태냅니다.
  // - 모든 아이템은 `Quality` 값을 가지며, 이것은 아이템의 가치를 나타냅니다.
  // - 하루가 지날때마다, 시스템은 두 값(`SellIn`, `Quality`)을 *1* 씩 감소시킵니다.
  it('normal item update', () => {
    // Normal Items
    const dexterityVest = new Item('+5 Dexterity Vest', 10, 20)
    const elixir = new Item('Elixir of the Mongoose', 5, 7)

    const gildedRose = new GildedRose([
      dexterityVest,
      elixir
    ])
    gildedRose.updateQuality()

    // dexterityVest
    expect(gildedRose.items[0].sellIn).toBe(9)
    expect(gildedRose.items[0].quality).toBe(19)

    // elixir
    expect(gildedRose.items[1].sellIn).toBe(4)
    expect(gildedRose.items[1].quality).toBe(6)
  })


  // - 판매하는 나머지 일수가 없어지면, `Quality` 값은 **2배**로 떨어집니다.
  // - `Quality` 값은 결코 음수가 되지는 않습니다.
  it('normal item update until sellIn', () => {
    // Normal Items
    const dexterityVest = new Item('+5 Dexterity Vest', 10, 20)
    const elixir = new Item('Elixir of the Mongoose', 5, 7)

    const gildedRose = new GildedRose([
      dexterityVest,
      elixir
    ])
    for (let i = 0; i < 10; i++) {
      gildedRose.updateQuality()
    }

    // dexterityVest
    expect(gildedRose.items[0].sellIn).toBe(0)
    expect(gildedRose.items[0].quality).toBe(10)

    // elixir
    expect(gildedRose.items[1].sellIn).toBe(0)
    expect(gildedRose.items[1].quality).toBe(0)
  })

  // - "**Aged Brie**"(오래된 브리치즈)은(는) 시간이 지날수록 `Quality` 값이 올라갑니다.
  it('aged brie update', () => {
    // Aged Brie
    const agedBrie = new Item('Aged Brie', 2, 0)
    const gildedRose = new GildedRose([
      agedBrie
    ])
    gildedRose.updateQuality()

    // agedBrie
    expect(gildedRose.items[0].quality).toBe(1)
  })

  // - `Quality` 값은 50를 초과 할 수 없습니다.
  it('aged brie update until quality 50', () => {
    // Aged Brie
    const agedBrie = new Item('Aged Brie', 2, 0)
    const gildedRose = new GildedRose([
      agedBrie
    ])
    for (let i = 0; i < 100; i++) {
      gildedRose.updateQuality()
    }

    // agedBrie
    expect(gildedRose.items[0].quality).toBe(50)
  })

  // - `Sulfuras`는 전설의 아이템이므로, 반드시 판매될 필요도 없고 `Quality` 값도 떨어지지 않습니다.
  it('sulfuras update', () => {
    // Sulfuras
    const sulfuras = new Item('Sulfuras, Hand of Ragnaros', 0, 80)
    const gildedRose = new GildedRose([
      sulfuras,
    ])
    for (let i = 0; i < 10; i++) {
      gildedRose.updateQuality()

      // sulfuras
      expect(gildedRose.items[0].sellIn).toBe(0)
      expect(gildedRose.items[0].quality).toBe(80)
    }
  })

  // `SellIn` 값이 0에 가까워 질수록 `Quality` 값이 상승하고,
  // 10일 전 부터는 매일 2 씩 증가하다
  // 5일 전이 되면 매일 3 씩 증가하지만,
  // 콘서트 종료 후에는 0으로 떨어집니다.
  it('backstage passes update', () => {
    // Backstage Passes
    const backstagePassesInfo = {
      sellIn: 15,
      quality: 20
    }
    const backstagePasses = new Item('Backstage passes to a TAFKAL80ETC concert', backstagePassesInfo.sellIn, backstagePassesInfo.quality)

    const gildedRose = new GildedRose([
      backstagePasses
    ])

    let expectedQuality = [ backstagePassesInfo.quality ]
    for (let i = backstagePassesInfo.sellIn; i > 0; i--) {
      let delta = 1
      if (i <= 10) delta = 2
      if (i <= 5) delta = 3
      expectedQuality.push(expectedQuality[expectedQuality.length - 1] + delta)
    }

    expectedQuality = [ ...expectedQuality.slice(1), 0, 0, 0, 0, 0 ]

    expectedQuality.forEach((quality) => {
      gildedRose.updateQuality()
      expect(gildedRose.items[0].quality).toBe(quality)
    })
  })

  // Conjured 아이템은 일반 아이템과 비슷하지만, `Quality` 값이 2배로 떨어집니다.
  it('conjured item update', () => {
    const SELL_IN = 3
    const QUALITY = 6
    // Conjured Items
    const conjuredManaCake = new Item('Conjured Mana Cake', SELL_IN, QUALITY)
    const gildedRose = new GildedRose([
      conjuredManaCake
    ])
    gildedRose.updateQuality()

    // sulfuras
    expect(gildedRose.items[0].sellIn).toBe(SELL_IN - 1)
    expect(gildedRose.items[0].quality).toBe(QUALITY - 2)
  })
})




