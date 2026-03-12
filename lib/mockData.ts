export type PackagingStatus = 'requested' | 'started' | 'completed' | 'held'
export type PackagingOption = '합포장' | '구성품만' | 'POB만' | '전체'

export interface ProductItem {
  name: string
  qty: number
  isPob?: boolean
}

// Legacy type — used by detail page
export interface PackagingItem {
  requestId: string
  userId: string
  packageCode: string
  packageAlias: string
  packagingOption: PackagingOption
  packageList: string[]
  userNote?: string
  productList: ProductItem[]
  storageLocation: string
  adminRecord: string
  quantity: number
  requestedAt: string
  daysSince: string
  adminMemo: string
  status: PackagingStatus
}

// New grouped type — used by list page
export interface SubPackage {
  packageCode: string
  packageAlias: string
  packagingOption: PackagingOption
  packageList: string[]
  userNote?: string
  productList: ProductItem[]
  storageLocation: string
  adminRecord: string
}

export interface PackagingRequest {
  requestId: string
  userId: string
  packageNumber: string
  packageNumberAlias: string
  packages: SubPackage[]
  requestedAt: string
  daysSince: string
  adminMemo: string
  status: PackagingStatus
}

export const MOCK_PACKAGING_REQUESTS: PackagingRequest[] = [
  // ── Page 1 (requests 1–10) ──────────────────────────────────────────────
  {
    requestId: '2601121705000105',
    userId: 'taroseok0319',
    packageNumber: 'yTgP27Oc9Q',
    packageNumberAlias: '눈꽃7314',
    packages: [
      {
        packageCode: 'xFWIcTLtkc',
        packageAlias: '눈꽃320',
        packagingOption: '합포장',
        packageList: ['구성품만'],
        productList: [
          { name: '이달의 소녀 LOONA 아르테미스 ARTMS 츄 CHU UUU 굿즈 일괄', qty: 5 },
        ],
        storageLocation: 'D-06-05',
        adminRecord: '배송 대행 주문 :w5tr0p & 536196821031 포카앨범 18EA, 포토카드 18EA',
      },
      {
        packageCode: 'xeKSHrJgyi',
        packageAlias: '눈꽃4102',
        packagingOption: '합포장',
        packageList: ['전체 (앨범, 포스터, 포토북 제외)'],
        productList: [
          { name: '[PRE-ORDER/EVENT] 82MAJOR - 2026 SPEC CALENDAR [우리의 계절]', qty: 2 },
          { name: '특전포카', qty: 5, isPob: true },
          { name: '특전포카2', qty: 5, isPob: true },
          { name: '사인 폴라로이드', qty: 5, isPob: true },
        ],
        storageLocation: 'C-03-04',
        adminRecord: '배송 대행 주문 :w5tr0p & 530695155834 CD앨범 5EA, 사인포토북 1EA, 포토카드 16EA',
      },
      {
        packageCode: 'w4UipEnPE3',
        packageAlias: '눈꽃3551',
        packagingOption: '구성품만',
        packageList: ['구성품만', '전체 (앨범, 포스터, 포토북 제외)'],
        userNote: 'the signed album plus all the pobs and the signed polaroid.',
        productList: [
          { name: 'Card-shaped photos printed with portraits', qty: 5 },
          { name: '12/11 1:1 영상통화 EVENT] 루네이트 (LUN8) - 2nd SINGLE ALBUM [LOST]', qty: 0 },
          { name: '포토카드, 특전 등 구성품 세트', qty: 3, isPob: true },
        ],
        storageLocation: 'D-06-05',
        adminRecord: '배송 대행 주문 :w5tr0p & 536196821031 포카앨범 18EA, 포토카드 18EA',
      },
    ],
    requestedAt: '2026-01-27',
    daysSince: '(D+0)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000106',
    userId: 'skyleralee90',
    packageNumber: 'pR9mKlJhGf',
    packageNumberAlias: '사슴벌레8851',
    packages: [
      {
        packageCode: 'x3Vv9sYvqY',
        packageAlias: '사슴벌레4891',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: 'Card-shaped photos printed with portraits', qty: 3 },
          { name: '루네이트 (LUN8) - 2nd SINGLE ALBUM [LOST] (DAY Ver. / LIGHT Ver.) (META)', qty: 0 },
          { name: '포토카드, 특전, 시즌그리팅 등 구성품 세트', qty: 2, isPob: true },
          { name: '특전 증명사진', qty: 1, isPob: true },
        ],
        storageLocation: 'F-01-02',
        adminRecord: '배송 대행 주문 :UUxNSA & 521289468740 포카앨범 2ea, 포토카드 3ea',
      },
      {
        packageCode: 'x3outluhFQ',
        packageAlias: '사슴벌레2276',
        packagingOption: '구성품만',
        packageList: ['구성품만', 'POB만'],
        userNote: 'the signed album plus all the pobs and the signed polaroid.',
        productList: [
          { name: '12/24 1:1 영상통화 EVENT] 루네이트 (LUN8) - 2nd SINGLE ALBUM [LOST]', qty: 0 },
          { name: '포토카드, 특전 등 구성품 세트', qty: 2, isPob: true },
          { name: 'Card-shaped photos printed with portraits', qty: 3 },
          { name: 'film prints', qty: 1 },
        ],
        storageLocation: 'D-06-05',
        adminRecord: '배송 대행 주문 :UUxNSA & 255738076974 포카앨범 12EA(사인앨범 1EA 포함), 포토카드 13EA',
      },
      {
        packageCode: 'm4UipEnRQ7',
        packageAlias: '사슴벌레1382',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: '루네이트 (LUN8) - 2nd SINGLE ALBUM [LOST] (DAY Ver. / LIGHT Ver.) (META)', qty: 0 },
          { name: '포토카드, 특전 등 구성품 세트', qty: 3, isPob: true },
          { name: 'Card-shaped photos printed with portraits', qty: 3 },
        ],
        storageLocation: 'D-06-05',
        adminRecord: '배송 대행 주문 :w5tr0p & 536196821031 포카앨범 18EA, 포토카드 18EA',
      },
    ],
    requestedAt: '2026-01-27',
    daysSince: '(D+0)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000107',
    userId: 'IZ0gEBbSzUdD4EktJyrgfspl',
    packageNumber: 'qT3nYzPxLm',
    packageNumberAlias: '문어9472',
    packages: [
      {
        packageCode: 'k7JpvBnX2L',
        packageAlias: '문어5719',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: '[10/19 1:1 VIDEO CALL FANSIGN] LUN8(루네이트) - 2nd SINGLE ALBUM [LOST]', qty: 0 },
          { name: '포토카드, 특전 등 구성품 세트', qty: 5, isPob: true },
          { name: 'Card-shaped photos printed with portraits', qty: 3 },
        ],
        storageLocation: 'D-06-05',
        adminRecord: '배송 대행 주문 :UUxNSA & 511201386616 / CD앨범 5EA, 특전포카 6EA',
      },
      {
        packageCode: 'm9QrTwYz3P',
        packageAlias: '문어1715',
        packagingOption: 'POB만',
        packageList: ['POB만'],
        userNote: 'the signed album plus all the pobs and the signed polaroid.',
        productList: [
          { name: '[준우][1/11 포토 이벤트] 루네이트 (LUN8) - 2nd SINGLE ALBUM [LOST]', qty: 0 },
          { name: 'POB: photocard', qty: 12, isPob: true },
        ],
        storageLocation: 'D-06-05',
        adminRecord: '-',
      },
    ],
    requestedAt: '2026-01-27',
    daysSince: '(D+0)',
    adminMemo: '-배송 대행 주문 :w5tr0p',
    status: 'started',
  },
  {
    requestId: '2601121705000108',
    userId: 'dana.al.baaj',
    packageNumber: 'wB7vXsOuRn',
    packageNumberAlias: '아기토끼6231',
    packages: [
      {
        packageCode: 'xMajOvcGXb',
        packageAlias: '아기토끼3469',
        packagingOption: '구성품만',
        packageList: ['구성품만', '전체 (앨범, 포스터, 포토북 제외)'],
        userNote: '주소 수정 완료, 확인 후 처리 바랍니다.',
        productList: [
          { name: 'P1Harmony OFFICIAL LIGHT STICK ver. 2 CUSTOM MASK', qty: 1 },
          { name: '일반', qty: 5 },
        ],
        storageLocation: 'C-03-04',
        adminRecord: '배송 대행 주문 :w5tr0p & 530695155834 CD앨범 5EA, 사인포토북 1EA, 포토카드 16EA',
      },
      {
        packageCode: 'tpAWEvfbmo',
        packageAlias: '아기토끼1044',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: '[I ONE] XLOVE 엑스러브', qty: 2 },
          { name: '해모지', qty: 1, isPob: true },
          { name: '포토카드 (달마시안)', qty: 1, isPob: true },
        ],
        storageLocation: 'F-01-02',
        adminRecord: '배송 대행 주문 :w5tr0p & 540691090201 82메이저 앨범 10개',
      },
    ],
    requestedAt: '2026-01-27',
    daysSince: '(D+0)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000109',
    userId: 'jessi-h.mail',
    packageNumber: 'cF4gMiKjHe',
    packageNumberAlias: '노을8814',
    packages: [
      {
        packageCode: 'n8pLsKtRwM',
        packageAlias: '노을3469',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: '[2/5 1:1 PHOTO EVENT] 베리베리 (VERIVERY) - 싱글4집 [Lost and Found] (Light ver.)', qty: 2 },
          { name: '특전포카', qty: 1, isPob: true },
        ],
        storageLocation: 'F-01-02',
        adminRecord: '배송 대행 주문 :w5tr0p & 540691090201 82메이저 앨범 10개',
      },
      {
        packageCode: 'x5SaIc8wAM',
        packageAlias: '노을1927',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: '[박치로우] 최림우 (CHUEL LI YU) - Single Album [SWEET DREAM] 발매기념 LUCKY DRAW EVENT', qty: 5 },
        ],
        storageLocation: 'D-06-05',
        adminRecord: '배송 대행 주문 :w5tr0p & 536196821031 포카앨범 18EA, 포토카드 18EA',
      },
    ],
    requestedAt: '2026-01-27',
    daysSince: '(D+0)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000111',
    userId: 'blueocean_kpop',
    packageNumber: 'hD2kPqLrGa',
    packageNumberAlias: '봄7134',
    packages: [
      {
        packageCode: 'nKpZr7AbcX',
        packageAlias: '봄3012',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'SEVENTEEN - 11th Mini Album [SEVENTEENTH HEAVEN]', qty: 3 },
          { name: '포토카드 세트 (랜덤)', qty: 2, isPob: true },
        ],
        storageLocation: 'A-02-01',
        adminRecord: '배송 대행 주문 :kpop01 & 772901234567 앨범 3EA, 포카 2EA',
      },
    ],
    requestedAt: '2026-01-27',
    daysSince: '(D+0)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000112',
    userId: 'starlight_moon99',
    packageNumber: 'jZ8bWnTvXc',
    packageNumberAlias: '달빛5392',
    packages: [
      {
        packageCode: 'mPqLs9XwRt',
        packageAlias: '달빛1847',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: 'aespa - MY WORLD - The 3rd Mini Album', qty: 2 },
          { name: 'Karina 사인 포토카드', qty: 1, isPob: true },
          { name: '포스터', qty: 1 },
        ],
        storageLocation: 'B-04-03',
        adminRecord: '배송 대행 주문 :star99 & 881029384756 앨범 2EA, 포스터 1EA',
      },
      {
        packageCode: 'rTuVwX1YzA',
        packageAlias: '달빛2193',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: '에스파 Winter 사인앨범', qty: 1 },
          { name: '포토카드, 특전 세트', qty: 4, isPob: true },
        ],
        storageLocation: 'B-04-04',
        adminRecord: '배송 대행 주문 :star99 & 881029384757',
      },
    ],
    requestedAt: '2026-01-27',
    daysSince: '(D+0)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000113',
    userId: 'hana_collector',
    packageNumber: 'yM5oQeNrFt',
    packageNumberAlias: '하나4867',
    packages: [
      {
        packageCode: 'bCdEfGhIjK',
        packageAlias: '잉어9201',
        packagingOption: 'POB만',
        packageList: ['POB만'],
        userNote: 'Please pack carefully, fragile items inside.',
        productList: [
          { name: 'IVE - I AM (POB 포토카드)', qty: 6, isPob: true },
          { name: 'Wonyoung 사인 폴라로이드', qty: 1, isPob: true },
        ],
        storageLocation: 'E-01-02',
        adminRecord: '배송 대행 주문 :hana01 & 994412345678',
      },
    ],
    requestedAt: '2026-01-26',
    daysSince: '(D+1)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000114',
    userId: 'jisoo_fanclub',
    packageNumber: 'lS6xAvJdCb',
    packageNumberAlias: '벚꽃3120',
    packages: [
      {
        packageCode: 'lMnOpQrStU',
        packageAlias: '벚꽃5500',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'BLACKPINK - BORN PINK (Box Set)', qty: 1 },
          { name: 'Jisoo 사인 포토북', qty: 1 },
          { name: '포토카드 세트', qty: 3, isPob: true },
        ],
        storageLocation: 'C-05-01',
        adminRecord: '배송 대행 주문 :jisoo_fc & 556677889900 Box 1EA',
      },
      {
        packageCode: 'vWxYzAbCdE',
        packageAlias: '벚꽃5501',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'BLACKPINK - THE ALBUM (COLLECTOR\'S EDITION)', qty: 2 },
          { name: '특전포카 (Lisa ver.)', qty: 2, isPob: true },
        ],
        storageLocation: 'C-05-02',
        adminRecord: '배송 대행 주문 :jisoo_fc & 556677889901',
      },
    ],
    requestedAt: '2026-01-26',
    daysSince: '(D+1)',
    adminMemo: '고객 VIP — 우선 처리',
    status: 'started',
  },
  {
    requestId: '2601121705000115',
    userId: 'melody_universe',
    packageNumber: 'uI1pHwEkBo',
    packageNumberAlias: '선율9043',
    packages: [
      {
        packageCode: 'fGhIjKlMnO',
        packageAlias: '봄7743',
        packagingOption: '구성품만',
        packageList: ['구성품만', '전체 (앨범, 포스터, 포토북 제외)'],
        productList: [
          { name: 'BTS - MAP OF THE SOUL: 7 (Ver.1)', qty: 1 },
          { name: 'Jimin 사인포토카드', qty: 1, isPob: true },
          { name: '포스터', qty: 2 },
          { name: '미니 포토북', qty: 1 },
        ],
        storageLocation: 'A-01-03',
        adminRecord: '배송 대행 주문 :melody & 112233445566 앨범 1EA, 포카 1EA',
      },
    ],
    requestedAt: '2026-01-26',
    daysSince: '(D+1)',
    adminMemo: '',
    status: 'started',
  },

  // ── Page 2 (requests 11–20) ─────────────────────────────────────────────
  {
    requestId: '2601121705000116',
    userId: 'pinkrose_k',
    packageNumber: 'tK0rCyFgDm',
    packageNumberAlias: '장미2768',
    packages: [
      {
        packageCode: 'pQrStUvWxY',
        packageAlias: '새4421',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'TWICE - Formula of Love: O+T=<3', qty: 2 },
          { name: 'Nayeon 사인 포토카드', qty: 1, isPob: true },
        ],
        storageLocation: 'D-03-02',
        adminRecord: '배송 대행 주문 :pinkrose & 223344556677',
      },
    ],
    requestedAt: '2026-01-26',
    daysSince: '(D+1)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000117',
    userId: 'night_kpop_shop',
    packageNumber: 'xO7aUqPiWs',
    packageNumberAlias: '은하4481',
    packages: [
      {
        packageCode: 'zAbCdEfGhI',
        packageAlias: '은하6612',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        userNote: '사인앨범 별도 포장 부탁드립니다.',
        productList: [
          { name: 'NCT 127 - 2 Baddies', qty: 2 },
          { name: 'Mark 사인앨범', qty: 1 },
          { name: '포토카드 (랜덤)', qty: 5, isPob: true },
        ],
        storageLocation: 'F-02-04',
        adminRecord: '배송 대행 주문 :nightk & 334455667788',
      },
      {
        packageCode: 'jKlMnOpQrS',
        packageAlias: '은하6613',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: 'NCT DREAM - Glitch Mode (Photobook ver.)', qty: 1 },
          { name: '특전포카 세트', qty: 3, isPob: true },
        ],
        storageLocation: 'F-02-05',
        adminRecord: '배송 대행 주문 :nightk & 334455667789',
      },
    ],
    requestedAt: '2026-01-25',
    daysSince: '(D+2)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000118',
    userId: 'sunflower_idol',
    packageNumber: 'vN4jLbRhYe',
    packageNumberAlias: '해바라기6102',
    packages: [
      {
        packageCode: 'tUvWxYzAbC',
        packageAlias: '가재8810',
        packagingOption: 'POB만',
        packageList: ['POB만'],
        productList: [
          { name: 'Stray Kids - MAXIDENT (POB 포토카드)', qty: 4, isPob: true },
          { name: 'Felix 사인 폴라로이드', qty: 1, isPob: true },
        ],
        storageLocation: 'E-03-01',
        adminRecord: '배송 대행 주문 :sunfl & 445566778899',
      },
    ],
    requestedAt: '2026-01-25',
    daysSince: '(D+2)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000119',
    userId: 'ocean_wave_merch',
    packageNumber: 'zA6iQcSmTo',
    packageNumberAlias: '파도9387',
    packages: [
      {
        packageCode: 'dEfGhIjKlM',
        packageAlias: '파도2234',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'ENHYPEN - MANIFESTO: DAY 1 (M ver.)', qty: 2 },
          { name: '포토카드 세트', qty: 4, isPob: true },
          { name: '미니 포스터', qty: 1 },
        ],
        storageLocation: 'B-01-05',
        adminRecord: '배송 대행 주문 :ocean & 556677889912',
      },
      {
        packageCode: 'nOpQrStUvW',
        packageAlias: '파도2235',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'ENHYPEN - DARK BLOOD (Weverse Albums ver.)', qty: 1 },
          { name: 'Sunghoon 사인 포토카드', qty: 1, isPob: true },
        ],
        storageLocation: 'B-01-06',
        adminRecord: '배송 대행 주문 :ocean & 556677889913',
      },
    ],
    requestedAt: '2026-01-25',
    daysSince: '(D+2)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000120',
    userId: 'cherry_blossom_k',
    packageNumber: 'fE3hMwKxBl',
    packageNumberAlias: '개나리1956',
    packages: [
      {
        packageCode: 'xYzAbCdEfG',
        packageAlias: '새9900',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        userNote: 'Please include all photocards, thank you!',
        productList: [
          { name: 'LE SSERAFIM - UNFORGIVEN (Weverse Albums ver.)', qty: 3 },
          { name: 'Kazuha 사인 포토카드', qty: 1, isPob: true },
          { name: '포토카드 랜덤', qty: 5, isPob: true },
        ],
        storageLocation: 'C-06-01',
        adminRecord: '배송 대행 주문 :cherry & 667788990011',
      },
    ],
    requestedAt: '2026-01-25',
    daysSince: '(D+2)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000121',
    userId: 'kpop_treasure_box',
    packageNumber: 'gC5kDpIrJn',
    packageNumberAlias: '보물7293',
    packages: [
      {
        packageCode: 'hIjKlMnOpQ',
        packageAlias: '잉어3377',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'TXT - The Name Chapter: TEMPTATION', qty: 2 },
          { name: 'Yeonjun 사인앨범', qty: 1 },
          { name: '포토카드 세트', qty: 3, isPob: true },
        ],
        storageLocation: 'A-03-02',
        adminRecord: '배송 대행 주문 :treasure & 778899001122',
      },
    ],
    requestedAt: '2026-01-24',
    daysSince: '(D+3)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000122',
    userId: 'aurora_kpop',
    packageNumber: 'bA8mFtGqEu',
    packageNumberAlias: '오로라5847',
    packages: [
      {
        packageCode: 'rStUvWxYzA',
        packageAlias: '오로라1155',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: 'ITZY - CHECKMATE (Platform ver.)', qty: 1 },
          { name: 'Ryujin 사인 포토카드', qty: 1, isPob: true },
          { name: 'POB 미니 포스터', qty: 2, isPob: true },
        ],
        storageLocation: 'D-04-03',
        adminRecord: '배송 대행 주문 :aurora & 889900112233',
      },
      {
        packageCode: 'bCdEfGhIjL',
        packageAlias: '오로라1156',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: 'ITZY - CRAZY IN LOVE', qty: 2 },
          { name: '특전포카 (Yeji ver.)', qty: 1, isPob: true },
        ],
        storageLocation: 'D-04-04',
        adminRecord: '배송 대행 주문 :aurora & 889900112234',
      },
    ],
    requestedAt: '2026-01-24',
    daysSince: '(D+3)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000123',
    userId: 'starship_collector',
    packageNumber: 'dV2nZoYlXq',
    packageNumberAlias: '항성3162',
    packages: [
      {
        packageCode: 'mNoPqRsTuV',
        packageAlias: '봄5588',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'MONSTA X - BEAUTIFUL MONSTER', qty: 2 },
          { name: 'Kihyun 사인 폴라로이드', qty: 1, isPob: true },
        ],
        storageLocation: 'E-05-02',
        adminRecord: '배송 대행 주문 :starship & 990011223344',
      },
    ],
    requestedAt: '2026-01-24',
    daysSince: '(D+3)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000124',
    userId: 'rainbow_merch',
    packageNumber: 'eW9pOuRsKj',
    packageNumberAlias: '무지개8034',
    packages: [
      {
        packageCode: 'wXyZaBcDeF',
        packageAlias: '새7766',
        packagingOption: 'POB만',
        packageList: ['POB만'],
        userNote: '포토카드 별도 슬리브 포장 부탁드립니다.',
        productList: [
          { name: '(여자)아이들 - I feel (POB 포토카드)', qty: 5, isPob: true },
          { name: 'Miyeon 사인 포토카드', qty: 1, isPob: true },
        ],
        storageLocation: 'F-06-01',
        adminRecord: '배송 대행 주문 :rainbow & 101122334455',
      },
    ],
    requestedAt: '2026-01-24',
    daysSince: '(D+3)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000125',
    userId: 'moonlight_shop',
    packageNumber: 'iR7fNqKvCd',
    packageNumberAlias: '월광4619',
    packages: [
      {
        packageCode: 'gHiJkLmNoP',
        packageAlias: '잉어8822',
        packagingOption: '구성품만',
        packageList: ['구성품만', '전체 (앨범, 포스터, 포토북 제외)'],
        productList: [
          { name: 'ASTRO - SWITCH ON (Switch ver.)', qty: 1 },
          { name: '포토카드 세트 (MJ ver.)', qty: 3, isPob: true },
          { name: '미니 포스터', qty: 1 },
        ],
        storageLocation: 'B-06-03',
        adminRecord: '배송 대행 주문 :moonlt & 211233445566',
      },
    ],
    requestedAt: '2026-01-23',
    daysSince: '(D+4)',
    adminMemo: '',
    status: 'started',
  },

  // ── Page 3 (requests 21–26) ─────────────────────────────────────────────
  {
    requestId: '2601121705000126',
    userId: 'galaxy_kpop_buy',
    packageNumber: 'kU1wHxBmTo',
    packageNumberAlias: '별자리7280',
    packages: [
      {
        packageCode: 'qRsTuVwXyZ',
        packageAlias: '가재4433',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'EXID - Eclipse (Limited Edition)', qty: 2 },
          { name: 'Hani 사인 포토카드', qty: 1, isPob: true },
        ],
        storageLocation: 'A-05-01',
        adminRecord: '배송 대행 주문 :galaxy & 312244556677',
      },
    ],
    requestedAt: '2026-01-23',
    daysSince: '(D+4)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000127',
    userId: 'crystal_collector',
    packageNumber: 'mX4yJzAnFp',
    packageNumberAlias: '수정2935',
    packages: [
      {
        packageCode: 'aBcDeFgHiJ',
        packageAlias: '봄1199',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        userNote: 'Do not fold the poster please.',
        productList: [
          { name: 'MAMAMOO - WAW (I ver.)', qty: 2 },
          { name: 'Solar 사인 폴라로이드', qty: 1, isPob: true },
          { name: '포스터 (한정)', qty: 1 },
        ],
        storageLocation: 'C-02-04',
        adminRecord: '배송 대행 주문 :crystal & 413355667788',
      },
    ],
    requestedAt: '2026-01-23',
    daysSince: '(D+4)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000128',
    userId: 'dream_kpop_store',
    packageNumber: 'nQ6bLcMrEg',
    packageNumberAlias: '꿈5748',
    packages: [
      {
        packageCode: 'kLmNoPqRsT',
        packageAlias: '꿈3301',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'GFRIEND - Song of the Sirens (Lullaby ver.)', qty: 1 },
          { name: '포토카드 세트', qty: 2, isPob: true },
        ],
        storageLocation: 'E-02-03',
        adminRecord: '배송 대행 주문 :dream & 514466778899',
      },
      {
        packageCode: 'uVwXyZaBcD',
        packageAlias: '꿈3302',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'GFRIEND - WALPURGIS NIGHT', qty: 2 },
          { name: 'Yuju 사인앨범', qty: 1 },
        ],
        storageLocation: 'E-02-04',
        adminRecord: '배송 대행 주문 :dream & 514466778900',
      },
    ],
    requestedAt: '2026-01-22',
    daysSince: '(D+5)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000129',
    userId: 'violet_star_shop',
    packageNumber: 'oT3dIaGkWh',
    packageNumberAlias: '제비꽃1826',
    packages: [
      {
        packageCode: 'eFgHiJkLmN',
        packageAlias: '잉어6699',
        packagingOption: 'POB만',
        packageList: ['POB만'],
        productList: [
          { name: 'Kang Daniel - MAGENTA (POB 세트)', qty: 3, isPob: true },
          { name: '한정 사인 포토카드', qty: 1, isPob: true },
        ],
        storageLocation: 'F-04-02',
        adminRecord: '배송 대행 주문 :violet & 615577889900',
      },
    ],
    requestedAt: '2026-01-22',
    daysSince: '(D+5)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000130',
    userId: 'sakura_merch',
    packageNumber: 'pS8eKbFjVn',
    packageNumberAlias: '연꽃9043',
    packages: [
      {
        packageCode: 'oPqRsTuVwX',
        packageAlias: '가재2277',
        packagingOption: '구성품만',
        packageList: ['구성품만'],
        productList: [
          { name: 'HyunA - NABILLERA (Collector\'s Edition)', qty: 1 },
          { name: '사인 포토북', qty: 1 },
          { name: '포토카드 (한정)', qty: 2, isPob: true },
        ],
        storageLocation: 'A-06-02',
        adminRecord: '배송 대행 주문 :sakura & 716688990011',
      },
    ],
    requestedAt: '2026-01-21',
    daysSince: '(D+6)',
    adminMemo: '',
    status: 'started',
  },
  {
    requestId: '2601121705000131',
    userId: 'stellar_kpop',
    packageNumber: 'qL5fMcHiYm',
    packageNumberAlias: '별똥별3678',
    packages: [
      {
        packageCode: 'yZaBcDeFgH',
        packageAlias: '봄9988',
        packagingOption: '합포장',
        packageList: ['합포장'],
        productList: [
          { name: 'SISTAR - TOUCH & MOVE (Repackage)', qty: 2 },
          { name: 'Hyolyn 사인 포토카드', qty: 1, isPob: true },
        ],
        storageLocation: 'B-05-05',
        adminRecord: '배송 대행 주문 :stellar & 817799001122',
      },
    ],
    requestedAt: '2026-01-21',
    daysSince: '(D+6)',
    adminMemo: '',
    status: 'started',
  },

  // ── Other statuses ───────────────────────────────────────────────────────
  {
    requestId: '2601121705000110',
    userId: 'wRGls45oiZRKoABlkmTClX',
    packageNumber: 'rP2gNdJwXo',
    packageNumberAlias: '참치8127',
    packages: [
      {
        packageCode: 'zRqTm18kXa',
        packageAlias: '참치5512',
        packagingOption: '합포장',
        packageList: ['전체'],
        productList: [
          { name: '82MAJOR 사인앨범', qty: 1 },
          { name: '포토카드 세트', qty: 3 },
        ],
        storageLocation: 'A-01-02',
        adminRecord: '구매 대행 주문',
      },
    ],
    requestedAt: '2026-01-24',
    daysSince: '(D+3)',
    adminMemo: '',
    status: 'requested',
  },
  {
    requestId: '2601121705000101',
    userId: 'completedUser01',
    packageNumber: 'sO9hKlIuBa',
    packageNumberAlias: '목련6259',
    packages: [
      {
        packageCode: 'cPkgAbc123',
        packageAlias: '목련1001',
        packagingOption: '구성품만',
        packageList: ['포토카드만'],
        productList: [{ name: 'LOONA 포토카드', qty: 5 }],
        storageLocation: 'B-02-03',
        adminRecord: '완료 처리됨',
      },
    ],
    requestedAt: '2026-01-20',
    daysSince: '(D+7)',
    adminMemo: '패키징 완료',
    status: 'completed',
  },
  {
    requestId: '2601121705000102',
    userId: 'heldUser01',
    packageNumber: 'tN7iLoHtCb',
    packageNumberAlias: '고래4381',
    packages: [
      {
        packageCode: 'hPkgXyz789',
        packageAlias: '고래2222',
        packagingOption: '합포장',
        packageList: ['전체'],
        productList: [
          { name: '사인앨범', qty: 2 },
          { name: 'POB 포카', qty: 3, isPob: true },
        ],
        storageLocation: 'E-04-01',
        adminRecord: '주소 확인 필요',
      },
    ],
    requestedAt: '2026-01-22',
    daysSince: '(D+5)',
    adminMemo: '유저 연락 대기 중',
    status: 'held',
  },
]

// Legacy flat list — used by detail page routing
export const MOCK_PACKAGING_ITEMS: PackagingItem[] = MOCK_PACKAGING_REQUESTS.flatMap(req =>
  req.packages.map((pkg, i) => ({
    requestId: i === 0 ? req.requestId : `${req.requestId}-${i + 1}`,
    userId: req.userId,
    packageCode: pkg.packageCode,
    packageAlias: pkg.packageAlias,
    packagingOption: pkg.packagingOption,
    packageList: pkg.packageList,
    userNote: pkg.userNote,
    productList: pkg.productList,
    storageLocation: pkg.storageLocation,
    adminRecord: pkg.adminRecord,
    quantity: pkg.productList.reduce((s, p) => s + p.qty, 0),
    requestedAt: req.requestedAt,
    daysSince: req.daysSince,
    adminMemo: req.adminMemo,
    status: req.status,
  }))
)

export const ADDITIONAL_PACKAGES = [
  { id: 'pkg-2', label: '📦 추가 패키지 #2', selected: true },
  { id: 'pkg-3', label: '📦 추가 패키지 #3', selected: false },
]
