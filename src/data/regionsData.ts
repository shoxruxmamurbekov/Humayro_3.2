export interface RegionVideoItem {
  id: string; // YouTube embed ID
  title: string;
  channel: string;
  duration: string;
  description: string;
  published: string;
}

export interface RegionDebateIssue {
  title: string;
  impactLevel: 'yuqori' | 'oʻrtacha' | 'muhim';
  description: string;
  causes: string[];
  publicReaction: string;
}

export interface RegionEventItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  summary: string;
}

export interface RegionIntelligence {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  continent: string;
  headline: string;
  summary: string;
  status: 'critical' | 'elevated' | 'monitored';
  statusLabel: string;
  activeEvents: RegionEventItem[];
  publicDebates: RegionDebateIssue[];
  keyIndicators: Array<{
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  youtubeVideos: RegionVideoItem[];
  featuredTopics: string[];
}

export const REGIONS_INTELLIGENCE_DATA: Record<string, RegionIntelligence> = {
  'central-asia': {
    id: 'central-asia',
    code: 'UZ/CA',
    name: "O'zbekiston va Markaziy Osiyo",
    nativeName: "Markaziy Osiyo mintaqasi",
    continent: "Osiyo",
    headline: "Raqamli infratuzilma, yashil energetika yo'laklari va suv resurslari xavfsizligi",
    summary: "Markaziy Osiyo bugungi kunda Yevroosiyoning eng tez o'sayotgan logistika va texnologiya markazlaridan biriga aylanmoqda. O'zbekiston rahbarligida yangi IT-parklar, sun'iy intellekt klasterlari, qayta tiklanuvchi quyosh-shamol elektr stansiyalari va transport habi kengaytirilmoqda.",
    status: 'elevated',
    statusLabel: "Yuqori faollik // Mintaqaviy yuksalish",
    activeEvents: [
      {
        id: 'ca-ev-1',
        title: "O'zbekistonda yirik xalqaro energetika va sun'iy intellekt infratuzilmasi forumi bo'lib o'tmoqda",
        source: "O'zA & Kun.uz",
        time: "15 daqiqa oldin",
        category: "Texnologiya & IT",
        summary: "Markaziy Osiyo davlatlari yagona raqamli axborot koridori va sun'iy intellekt ma'lumotlar markazlarini qurish bo'yicha yirik kelishuvlarni imzolamoqda."
      },
      {
        id: 'ca-ev-2',
        title: "Trans-Kaspiy va Markaziy Osiyo temir yo'l magistrallari o'tkazuvchanligi oshirildi",
        source: "Daryo & Reuters",
        time: "42 daqiqa oldin",
        category: "Logistika",
        summary: "Yevropa va Xitoy o'rtasidagi «O'rta yo'lak» (Middle Corridor) orqali yuk tashish hajmi rekord darajaga yetdi."
      },
      {
        id: 'ca-ev-3',
        title: "Orolbo'yi va Amudaryo-Sirdaryo havzasida suvni tejovchi aqlli datchiklar joriy etilmoqda",
        source: "Gazeta.uz",
        time: "1 soat oldin",
        category: "Ekologiya",
        summary: "Mintaqada iqlim isishi sharoitida suv yo'qotilishining oldini olish uchun raqamli gidrotexnika tizimlari sinovdan o'tkazilmoqda."
      }
    ],
    publicDebates: [
      {
        title: "Energetika me'yorlari va kommunal tarmoqlarni modernizatsiya qilish",
        impactLevel: 'yuqori',
        description: "Aholi va kichik biznes vakillari elektr energiyasi, gaz ta'minoti hamda energiya tejamkor texnologiyalarga o'tish mexanizmlarini keng muhokama qilmoqda.",
        causes: [
          "Qishki va yozgi yuklamalar davrida barqaror elektr ta'minoti zarurati",
          "Katta quvvatli quyosh va shamol elektr stansiyalarini tarmoqqa to'liq integratsiya qilish",
          "Hisoblagichlar va billing tizimlarining shaffofligi talabi"
        ],
        publicReaction: "Jamoatchilik yangi stansiyalar ishga tushishi natijasida uzilishlarning butunlay barham topishini va narxlarning barqaror qolishini kutmoqda."
      },
      {
        title: "Mintaqaviy suv resurslari va transchegaraviy daryolardan oqilona foydalanish",
        impactLevel: 'yuqori',
        description: "Markaziy Osiyoda muzliklarning erishi va qishloq xo'jaligi talabi ortishi fonida qo'shni davlatlar o'rtasida suv balansi bo'yicha diplomatik kelishuvlar dolzarb bo'lib qolmoqda.",
        causes: [
          "Qo'shtepa kanali qurilishi va suv taqsimoti balansi",
          "Tomchilatib sug'orishga o'tishni majburiylashtirish va davlat subsidiyalari",
          "Orol dengizi tubida yashil qoplamalarni ko'paytirish"
        ],
        publicReaction: "Olimlar va aholi suvni isrof qilmaslik, sun'iy intellekt orqali sug'orishni optimallashtirish zarurligini ilgari surmoqda."
      },
      {
        title: "Ta'lim sifati, OTM kontraktlari va yoshlar bandligi",
        impactLevel: 'oʻrtacha',
        description: "IT va zamonaviy kasblarga o'qitish dasturlari, oliy ta'lim muassasalarida amaliyot bilan bog'liqlik va talabalar uchun grantlar tizimi faol bahslashilmoqda.",
        causes: [
          "Mehnat bozorida sun'iy intellekt va muhandislik mutaxassislariga bo'lgan kuchli talab",
          "Bitiruvchilarning xalqaro standartlarga mos bilimlarga ega bo'lishi"
        ],
        publicReaction: "Aholi ta'limda nazariyadan ko'ra haqiqiy ishlab chiqarish va texnologiya amaliyotini kuchaytirishni talab qilmoqda."
      }
    ],
    keyIndicators: [
      { label: "Mintaqaviy YaIM o'sishi", value: "+5.8%", trend: 'up' },
      { label: "IT va autsorsing eksporti", value: "$1.2 mlrd", trend: 'up' },
      { label: "Yashil energetika ulushi", value: "24.5%", trend: 'up' },
      { label: "Aholi soni o'sishi", value: "+1.9% / yil", trend: 'up' }
    ],
    youtubeVideos: [
      {
        id: '8nQyvP2aZfA',
        title: "Uzbekistan: Central Asia's Emerging Renewable Energy & Tech Hub",
        channel: "Euronews Global Focus",
        duration: "08:45",
        description: "O'zbekistonda barpo etilayotgan yirik quyosh va shamol elektr stansiyalari hamda xalqaro IT investitsiyalar tahlili.",
        published: "2026"
      },
      {
        id: 'wO2lZ45pY4U',
        title: "The New Silk Road: Central Asia's Strategic Transportation Corridor",
        channel: "BBC News Analysis",
        duration: "12:18",
        description: "Markaziy Osiyoning dengizga chiqish yo'llari, Trans-Kaspiy yo'nalishi va global iqtisodiy ahamiyati.",
        published: "2026"
      },
      {
        id: 'e_zN_Y5-GzM',
        title: "How Water and Climate Diplomacy Are Shaping Central Asia's Future",
        channel: "DW Documentaries",
        duration: "14:32",
        description: "Amudaryo va Sirdaryo havzasida suv xavfsizligi, muzliklar holati va mintaqaviy hamkorlik istiqbollari.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "O'zbekistonda IT Park va sun'iy intellekt",
      "Markaziy Osiyo yashil energetika loyihalari",
      "Suv resurslarini tejash texnologiyalari",
      "Toshkent xalqaro investitsiya forumi"
    ]
  },
  'east-asia': {
    id: 'east-asia',
    code: 'KR/EA',
    name: "Sharqiy Osiyo va Tinch Okeani",
    nativeName: "East Asia & Pacific Rim",
    continent: "Osiyo",
    headline: "Yarimo'tkazgichlar ishlab chiqarish poygasi va sun'iy intellekt chiplari",
    summary: "Sharqiy Osiyo (Janubiy Koreya, Yaponiya, Tayvan, Xitoy) butun dunyo kompyuter chiplari, HBM xotira modullari va ilg'or robototexnikaning 80% dan ortig'ini ta'minlaydi. Mintaqadagi texnologik va harbiy-iqtisodiy raqobat global bozorlarni boshqarmoqda.",
    status: 'critical',
    statusLabel: "Kritik diqqat // Global chip poygasi",
    activeEvents: [
      {
        id: 'ea-ev-1',
        title: "Samsung va SK Hynix yangi avlod HBM4 AI xotira chiplarini taqdim etdi",
        source: "Yonhap News & Bloomberg",
        time: "22 daqiqa oldin",
        category: "Mikrochiplar",
        summary: "Sun'iy intellekt superkompyuterlari uchun mo'ljallangan rekord o'tkazuvchanlikdagi yangi yarimo'tkazgichlar seriyali ishlab chiqarishga kiritildi."
      },
      {
        id: 'ea-ev-2',
        title: "Yaponiya yarimo'tkazgich va kvant hisoblash infratuzilmasiga $20 milliard ajratdi",
        source: "Nikkei Asia",
        time: "1 soat oldin",
        category: "Sarmoya",
        summary: "Yaponiya hukumati va xususiy korporatsiyalar Tokio va Xokkaydoda 2nm texnologiyali chip zavodlarini jadallashtirmoqda."
      },
      {
        id: 'ea-ev-3',
        title: "Tayvan bo'g'ozi atrofida xalqaro yuk tashish xavfsizligi va logistika monitoringi",
        source: "Reuters",
        time: "2 soat oldin",
        category: "Geosiyosat",
        summary: "Global konteyner tashuvlarining uchdan bir qismi o'tadigan bo'g'ozda xalqaro kemalar erkin harakati kafolatlari ko'rib chiqilmoqda."
      }
    ],
    publicDebates: [
      {
        title: "Global AI chiplari taqchilligi va ishlab chiqarish monopoliyasi",
        impactLevel: 'yuqori',
        description: "Dunyodagi eng ilg'or 3nm va 2nm chiplar faqat Sharqiy Osiyoda ishlab chiqarilayotgani global iqtisodiy xavf sifatida muhokama qilinmoqda.",
        causes: [
          "Sun'iy intellekt markazlarining chiplarga bo'lgan to'xtovsiz ehtiyoji",
          "Tayvan va Janubiy Koreyadagi fabrikalarning yuqori konsentratsiyasi",
          "Nodir metallar va litiy eksportidagi cheklovlar"
        ],
        publicReaction: "Jahon kompaniyalari chip yetkazib berish zanjirini diversifikatsiya qilishga urinmoqda."
      },
      {
        title: "Demografik inqiroz va keksayayotgan aholi uchun robototexnika",
        impactLevel: 'oʻrtacha',
        description: "Janubiy Koreya va Yaponiyada tug'ilishning kamayishi sababli mehnat bozoridagi yetishmovchilik sun'iy intellekt va gumanoid robotlar orqali qoplanmoqda.",
        causes: [
          "Dunyo bo'yicha eng past tug'ilish koeffitsiyenti",
          "Ishchi kuchining kamayishi va pensiya fondlari yuki"
        ],
        publicReaction: "Jamiyatda avtomatlashtirish hayotiy zarurat sifatida qabul qilinmoqda."
      }
    ],
    keyIndicators: [
      { label: "Global chip ulushi", value: "82%", trend: 'up' },
      { label: "AI R&D xarajatlari", value: "$180 mlrd", trend: 'up' },
      { label: "Avtomatlashtirish darajasi", value: "Jahonda 1-o'rin", trend: 'stable' },
      { label: "Savdo profitsiti", value: "+$42 mlrd", trend: 'up' }
    ],
    youtubeVideos: [
      {
        id: 'rW1QeT8m9aI',
        title: "Inside the High-Stakes Global AI Chip War in East Asia",
        channel: "Bloomberg Technology",
        duration: "16:20",
        description: "Janubiy Koreya, Yaponiya va Tayvanning sun'iy intellekt chiplari poygasidagi mutlaq yetakchiligi.",
        published: "2026"
      },
      {
        id: 'g_Xb0Ea1K34',
        title: "How South Korea and Taiwan Dominate the Semiconductor World",
        channel: "CNBC International",
        duration: "13:40",
        description: "Nega butun dunyo texnologiyasi bir nechta Osiyo zavodlariga qaram ekanligi haqida chuqur reportaj.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "Janubiy Koreya HBM4 AI chiplari",
      "Tayvan bo'g'ozi va dengiz yo'llari xavfsizligi",
      "Yaponiyada robototexnika va sun'iy intellekt",
      "Sharqiy Osiyoda energetika almashinuvi"
    ]
  },
  'europe': {
    id: 'europe',
    code: 'EU/BRU',
    name: "Yevropa Ittifoqi va Buyuk Britaniya",
    nativeName: "European Union & United Kingdom",
    continent: "Yevropa",
    headline: "Energetika xavfsizligi, sun'iy intellektni tartibga solish va yashil qonunchilik",
    summary: "Yevropa Ittifoqi (Bryussel, Berlin, Parij, London) jahonda ilk marotaba keng qamrovli «AI Act» qonunini to'liq joriy qildi. Shu bilan birga qit'ada yashil energiya integratsiyasi, sanoat raqobatbardoshligi va mudofaa xarajatlari qizg'in bahslarga sabab bo'lmoqda.",
    status: 'elevated',
    statusLabel: "Yuqori faollik // Qonunchilik va sanoat islohoti",
    activeEvents: [
      {
        id: 'eu-ev-1',
        title: "Yevropa Ittifoqining yangi AI me'yorlari va xavfsizlik talablari rasman kuchga kirdi",
        source: "Deutsche Welle & Reuters",
        time: "35 daqiqa oldin",
        category: "Qonunchilik",
        summary: "Kompaniyalar sun'iy intellekt tizimlari shaffofligi, mualliflik huquqi va shaxsiy ma'lumotlar xavfsizligini ta'minlashga majbur qilindi."
      },
      {
        id: 'eu-ev-2',
        title: "Shimoliy dengiz shamol energiyasi tarmog'i Yevropa qit'asini to'liq qamrab olmoqda",
        source: "BBC News",
        time: "1 soat oldin",
        category: "Ekologiya",
        summary: "Daniya, Germaniya va Niderlandiya Shimoliy dengizda ulkan suzuvchi shamol elektr turbinalari klasterini ishga tushirdi."
      },
      {
        id: 'eu-ev-3',
        title: "Yevropa Markaziy Banki iqtisodiy o'sishni rag'batlantirish uchun foiz stavkalarini pasaytirdi",
        source: "Financial Times",
        time: "3 soat oldin",
        category: "Iqtisodiyot",
        summary: "Inflyatsiyaning 2% lik maqsadli darajaga tushishi munosabati bilan Yevrohududda kreditlash shartlari yengillashmoqda."
      }
    ],
    publicDebates: [
      {
        title: "Sanoat raqobatbardoshligi va qat'iy ekologik qoidalar to'qnashuvi",
        impactLevel: 'yuqori',
        description: "Yevropadagi avtomobilsozlik va og'ir sanoat korxonalari Xitoy va AQSH bilan raqobatda ekologik talablar sanoat xarajatlarini oshirayotganini aytmoqda.",
        causes: [
          "Uglerod solig'i (CBAM) va elektr avtomobillarga o'tish muddatlari",
          "Germaniya va Fransiyada elektr energiyasi narxining nisbatan yuqoriligi"
        ],
        publicReaction: "Jamoatchilik atrof-muhitni asrash va ish o'rinlarini saqlab qolish o'rtasida murosa izlamoqda."
      },
      {
        title: "Sun'iy intellektni qat'iy tartibga solish innovatsiyalarni sekinlashtiradimi?",
        impactLevel: 'muhim',
        description: "Yevropalik startaplar va texnologik gigantlar qat'iy qoidalar AI ixtirolarini AQSH va Osiyoga ko'chib ketishiga sabab bo'lishidan xavotirda.",
        causes: [
          "Jahon bo'yicha eng qattiq jarimalar tizimi (kompaniya aylanmasining 7% igacha)",
          "Deepfake va biometrik kuzatuv tizimlariga qo'yilgan to'siqlar"
        ],
        publicReaction: "Fuqarolar shaxsiy daxlsizlik himoyasini ma'qullamoqda, ammo biznes moslashuvchanlik so'ramoqda."
      }
    ],
    keyIndicators: [
      { label: "Yillik inflyatsiya", value: "2.1%", trend: 'down' },
      { label: "Qayta tiklanuvchi energiya", value: "52%", trend: 'up' },
      { label: "Mudofaa xarajatlari", value: "YaIMning 2.2%", trend: 'up' },
      { label: "Texnologiya investitsiyalari", value: "€95 mlrd", trend: 'stable' }
    ],
    youtubeVideos: [
      {
        id: '2eZ0t1i7_eQ',
        title: "Europe's AI Act: How Strict Rules Will Impact Global Tech",
        channel: "DW News Analysis",
        duration: "11:05",
        description: "Yevropa Ittifoqining sun'iy intellekt qonunlari jahon texnologiya bozorlariga qanday ta'sir qilmoqda?",
        published: "2026"
      },
      {
        id: 'e_WqP34-b_M',
        title: "The Battle for Europe's Industrial Future & Green Transition",
        channel: "Euronews In Focus",
        duration: "09:40",
        description: "Yevropa sanoati qanday qilib arzon energiya va yangi bozorlar uchun kurashmoqda.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "Yevropa Ittifoqi AI qonunchiligi",
      "Yevrohudud foiz stavkalari va iqtisodiy o'sish",
      "Yashil energetika va vodorod magistrallari",
      "Avtomobilsozlik sanoatidagi transformatsiya"
    ]
  },
  'north-america': {
    id: 'north-america',
    code: 'US/NA',
    name: "Shimoliy Amerika (AQSH va Kanada)",
    nativeName: "North America (USA & Canada)",
    continent: "Shimoliy Amerika",
    headline: "Silikon vodiysi sun'iy intellekt inqilobi, Wall Street va texnologik gigantlar",
    summary: "AQSH va Shimoliy Amerika global sun'iy intellekt tadqiqotlari, ma'lumot markazlari infratuzilmasi va eng yirik moliya bozorlariga mezbonlik qiladi. Sun'iy intellektning ish o'rinlariga ta'siri, ma'lumot markazlarining ulkan elektr ehtiyojlari va moliya bozorlari muhokama markazida.",
    status: 'critical',
    statusLabel: "Kritik diqqat // Global texno-moliyaviy poytaxt",
    activeEvents: [
      {
        id: 'na-ev-1',
        title: "AQSH texnologiya kompaniyalari AI ma'lumot markazlari uchun $200 milliard sarmoya kiritmoqda",
        source: "Wall Street Journal & Bloomberg",
        time: "18 daqiqa oldin",
        category: "Sun'iy intellekt",
        summary: "Superkompyuter klasterlarini energiya bilan ta'minlash uchun xususiy atom va geotermal energiya loyihalari boshlandi."
      },
      {
        id: 'na-ev-2',
        title: "Federal Zaxira Tizimi (FRS) asosiy foiz stavkasi bo'yicha yillik strategiyasini e'lon qildi",
        source: "Reuters",
        time: "50 daqiqa oldin",
        category: "Moliya",
        summary: "Mehnat bozori barqarorligi va texnologik sohadagi sur'at moliya bozorlarini rag'batlantirmoqda."
      },
      {
        id: 'na-ev-3',
        title: "NASA va xususiy kosmik kompaniyalar oyga yangi doimiy stansiya modulini uchirdi",
        source: "Associated Press",
        time: "2 soat oldin",
        category: "Kosmos & Ilm-fan",
        summary: "Artemis dasturi doirasida xalqaro ilmiy baza va resurslarni o'rganish missiyasi yangi bosqichga ko'tarildi."
      }
    ],
    publicDebates: [
      {
        title: "Sun'iy intellekt ma'lumot markazlarining elektr tarmog'iga favqulodda yuki",
        impactLevel: 'yuqori',
        description: "Har bir yirik AI modeli teravattlab elektr energiyasi talab qilmoqda, bu esa shahar energetika tarmoqlarida narxlar oshishiga sabab bo'lmoqda.",
        causes: [
          "GPU klasterlarining 24/7 tinimsiz sovutish va hisoblash ehtiyoji",
          "Kichik modulli atom reaktorlariga (SMR) bo'lgan talabning ortishi"
        ],
        publicReaction: "Ekologlar va aholi toza energiyadan birinchi navbatda fuqarolar foydalanishi kerakligini talab qilmoqda."
      },
      {
        title: "Avtomatlashtirish va kasblar kelajagi",
        impactLevel: 'yuqori',
        description: "Dasturchilar, huquqshunoslar, tahlilchilar va moliya mutaxassislari ish o'rinlarining sun'iy intellekt agentlari tomonidan o'zgartirilishi katta rezonans keltirib chiqarmoqda.",
        causes: [
          "Avtonom AI agentlarining murakkab vazifalarni soniyalarda bajarishi",
          "Kompaniyalarning samaradorlikni oshirish uchun shtatlarni qisqartirishi"
        ],
        publicReaction: "Universitetlar va kasaba uyushmalari kadrlar malakasini zudlik bilan qayta oshirish tizimlarini talab qilmoqda."
      }
    ],
    keyIndicators: [
      { label: "AI R&D xarajatlari", value: "$310 mlrd", trend: 'up' },
      { label: "S&P 500 yillik o'sishi", value: "+14.2%", trend: 'up' },
      { label: "Ishsizlik darajasi", value: "3.9%", trend: 'stable' },
      { label: "Texnologiya patenti arizalari", value: "120,000+", trend: 'up' }
    ],
    youtubeVideos: [
      {
        id: '0K7bV5h8f4A',
        title: "How AI Data Centers Are Reshaping the US Energy Grid",
        channel: "Wall Street Journal",
        duration: "14:15",
        description: "Sun'iy intellekt markazlari nega butun boshli shaharlardan ko'proq elektr talab qilmoqda?",
        published: "2026"
      },
      {
        id: 'z_G5l4M_Q9A',
        title: "The Silicon Valley Boom: AI Economy and Future of Jobs",
        channel: "Bloomberg Originals",
        duration: "18:30",
        description: "Silikon vodiysining yangi to'lqini va global mehnat bozoridagi tub burilishlar.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "AQSH Federal Zaxira Tizimi qarorlari",
      "Silikon vodiysida AI agentlari poygasi",
      "Yadroviy energiya va ma'lumot markazlari",
      "Artemis oy dasturi va yangi kosmik iqtisodiyot"
    ]
  },
  'middle-east': {
    id: 'middle-east',
    code: 'ME/GULF',
    name: "Yaqin Sharq va Fors ko'rfazi",
    nativeName: "Middle East & Gulf Region",
    continent: "Osiyo / Yaqin Sharq",
    headline: "Neftdan keyingi iqtisodiy diversifikatsiya, sun'iy intellekt fondlari va tinchlik diplomatiyasi",
    summary: "Fors ko'rfazi davlatlari (BAA, Saudiya Arabistoni, Qatar) yuzlab milliard dollarlik suveren fondlarni neftga qaramlikni tugatish, sun'iy intellekt markazlari qurish va xalqaro turizm-logistika habiga aylantirishga yo'naltirmoqda. Shu bilan birga mintaqaviy xavfsizlik va gumanitar koridorlar doimiy e'tibor markazida.",
    status: 'elevated',
    statusLabel: "Yuqori faollik // Strategik transformatsiya",
    activeEvents: [
      {
        id: 'me-ev-1',
        title: "BAA va Saudiya Arabistoni $100 milliardlik global AI investitsiya fondini ishga tushirdi",
        source: "Al Jazeera & Reuters",
        time: "40 daqiqa oldin",
        category: "Sarmoya",
        summary: "Ko'rfaz mamlakatlari eng ilg'or sun'iy intellekt modellari, chiplar va toza energiya infratuzilmasiga ulkan mablag' kiritmoqda."
      },
      {
        id: 'me-ev-2',
        title: "Qizil dengiz va xalqaro bo'g'ozlarda savdo xavfsizligi bo'yicha diplomatik muzokaralar",
        source: "Associated Press",
        time: "1 soat oldin",
        category: "Diplomatiya",
        summary: "Global neft va konteyner yo'llarini himoya qilish bo'yicha mintaqaviy koalitsiya yangi mexanizmlarni ko'rib chiqmoqda."
      },
      {
        id: 'me-ev-3',
        title: "Yaqin Sharqda eng yirik quyosh va vodorod zavodlari tarmog'i ishga tushirildi",
        source: "Gulf News",
        time: "3 soat oldin",
        category: "Energetika",
        summary: "Ar-Riyod va Abu-Dabi Yevropa va Osiyoga toza yashil vodorod eksport qilish shartnomalarini tasdiqladi."
      }
    ],
    publicDebates: [
      {
        title: "Ko'rfaz davlatlarining global texnologiya yetakchiligiga intilishi",
        impactLevel: 'yuqori',
        description: "BAA va Saudiya Arabistonining sun'iy intellekt va superkompyuterlarga ulkan investitsiyalari mintaqani Silicon Valley bilan raqobatlasha oladigan darajaga ko'tarmoqda.",
        causes: [
          "Neft daromadlarini kelajak texnologiyalariga yo'naltirish (Vision 2030)",
          "Xalqaro IT mutaxassislari uchun maxsus soliq va viza imtiyozlari"
        ],
        publicReaction: "Jamoatchilik mintaqaning global ilm-fan va innovatsiya markaziga aylanishini qizg'in qo'llab-quvvatlamoqda."
      },
      {
        title: "Barqaror tinchlik va gumanitar xavfsizlik mexanizmlari",
        impactLevel: 'yuqori',
        description: "Yaqin Sharqda uzoq muddatli barqarorlikni ta'minlash, insonparvarlik yordami koridorlari va qayta tiklash ishlari xalqaro jamoatchilik muhokamasida.",
        causes: [
          "G'azo va mintaqaviy keskinliklarni bartaraf etish sa'y-harakatlari",
          "Xalqaro vositachilar va BMT rezolyutsiyalarining ijrosi"
        ],
        publicReaction: "Dunyo bo'ylab millionlab odamlar qon to'kilishini butunlay to'xtatish va adolatli yechim topishni talab qilmoqda."
      }
    ],
    keyIndicators: [
      { label: "Suveren fondlar kapitali", value: "$4.1 trln", trend: 'up' },
      { label: "Qayta tiklanuvchi energiya", value: "38 GW", trend: 'up' },
      { label: "Xalqaro parvozlar trafigi", value: "+18%", trend: 'up' },
      { label: "Logistika o'tkazuvchanligi", value: "Jahonda top-3", trend: 'stable' }
    ],
    youtubeVideos: [
      {
        id: 'Jg6yE8Z8r9A',
        title: "How the Gulf is Becoming the Next Global Tech Powerhouse",
        channel: "Al Jazeera English",
        duration: "12:50",
        description: "BAA va Saudiya Arabistonining neftdan keyingi sun'iy intellekt va texnologiya strategiyasi.",
        published: "2026"
      },
      {
        id: 'dG0L_L5w-3A',
        title: "The Battle for Red Sea Trade Corridors and Middle East Security",
        channel: "Reuters In-Depth",
        duration: "10:15",
        description: "Qizil dengizdagi xavfsizlik, yuk tashuvlari va jahon bozorlariga ta'siri.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "Saudiya Vision 2030 va NEOM loyihalari",
      "BAA sun'iy intellekt strategiyasi",
      "Qizil dengizda savdo xavfsizligi",
      "Yashil vodorod eksporti shartnomalari"
    ]
  },
  'africa': {
    id: 'africa',
    code: 'AFR',
    name: "Afrika qit'asi",
    nativeName: "African Union / Pan-African Sphere",
    continent: "Afrika",
    headline: "Kontinental erkin savdo zonasi (AfCFTA), mobil fintex va quyosh megaproektlari",
    summary: "Afrika bugun dunyodagi eng yosh aholiga ega qit'a bo'lib, mobil to'lovlar, fintex startaplar va qayta tiklanuvchi energiya bo'yicha global peshqadamlikka intilmoqda. Shu bilan birga oziq-ovqat xavfsizligi va infratuzilma modernizatsiyasi dolzarb muammo bo'lib qolmoqda.",
    status: 'monitored',
    statusLabel: "Monitoringda // Yangi iqtisodiy uyg'onish",
    activeEvents: [
      {
        id: 'afr-ev-1',
        title: "AfCFTA qit'alararo raqamli to'lovlar tizimi 35 ta davlatda integratsiya qilindi",
        source: "BBC World Africa",
        time: "48 daqiqa oldin",
        category: "Fintex",
        summary: "Afrika davlatlari dollar yoki chet el valyutasisiz to'g'ridan-to'g'ri o'zaro milliy valyutalarda savdo qilish imkoniga ega bo'ldi."
      },
      {
        id: 'afr-ev-2',
        title: "Saxarada dunyodagi eng yirik quyosh panellari megaparki qurilishi boshlandi",
        source: "Deutsche Welle Africa",
        time: "2 soat oldin",
        category: "Yashil energiya",
        summary: "Yevropa va Shimoliy Afrikani bog'lovchi elektr suvosti kabeli orqali toza energiya yetkazib berish rejalashtirilmoqda."
      }
    ],
    publicDebates: [
      {
        title: "Nodir metallar va xomashyo ustidan milliy suverenitet",
        impactLevel: 'yuqori',
        description: "Kobalt, litiy va oltin ishlab chiqaruvchi Afrika davlatlari xomashyoni shunchaki eksport qilishni to'xtatib, batareya va chiplarni o'z hududida ishlab chiqarishni talab qilmoqda.",
        causes: [
          "Elektromobillar va elektronika uchun kobalt va litiyga global ehtiyoj",
          "Ko'p yillik adolatsiz savdo kelishuvlarini qayta ko'rib chiqish"
        ],
        publicReaction: "Mahalliy aholi va yoshlar daromadlar qit'aning o'zida qolishi kerakligini ta'kidlamoqda."
      },
      {
        title: "Mobil internet va yoshlar ta'limi",
        impactLevel: 'oʻrtacha',
        description: "Starlink va mahalliy sun'iy yo'ldosh tarmoqlari qishloq joylarida ta'lim sifatini tubdan o'zgartirmoqda.",
        causes: [
          "Qit'ada o'rtacha yosh 19 yoshni tashkil etishi",
          "Dasturlash va masofaviy ishlashga bo'lgan ulkan intilish"
        ],
        publicReaction: "Raqamli iqtisodiyot yoshlar migratsiyasini kamaytirishning asosiy yo'li deb ko'rilmoqda."
      }
    ],
    keyIndicators: [
      { label: "Mobil to'lovlar o'sishi", value: "+28% / yil", trend: 'up' },
      { label: "Aholi o'rtacha yoshi", value: "19.2 yosh", trend: 'stable' },
      { label: "Yashil energiya salohiyati", value: "Dunyoda 1-o'rin", trend: 'up' },
      { label: "AfCFTA a'zolari", value: "54 davlat", trend: 'up' }
    ],
    youtubeVideos: [
      {
        id: 'kL7r8p1m-9A',
        title: "Africa's Mobile Tech & Green Revolution: The Leapfrog Effect",
        channel: "DW Documentaries",
        duration: "13:20",
        description: "Afrikada mobil bank tizimlari va toza energiya qanday qilib qit'ani o'zgartirmoqda.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "AfCFTA qit'aviy erkin savdo zonasi",
      "Keniya va Nigeriyada fintex o'sishi",
      "Nodir minerallar va litiy sanoati",
      "Saxara quyosh energetikasi loyihalari"
    ]
  },
  'south-america': {
    id: 'south-america',
    code: 'SA/MER',
    name: "Janubiy Amerika (Lotin Amerikasi)",
    nativeName: "South America / Mercosur",
    continent: "Janubiy Amerika",
    headline: "Litiy uchburchagi, Amazonka ekologiyasi va bio-yoqilg'i integratsiyasi",
    summary: "Janubiy Amerika (Braziliya, Argentina, Chili, Kolumbiya) global elektromobil akkumulyatorlari uchun zarur litiy zaxiralarining yarmidan ko'piga egalik qiladi. Amazonka o'rmonlarini saqlab qolish va yangi iqtisodiy koridorlar muhokamalarga sabab bo'lmoqda.",
    status: 'monitored',
    statusLabel: "Monitoringda // Resurslar va ekologik balans",
    activeEvents: [
      {
        id: 'sa-ev-1',
        title: "Chili va Argentina litiy qazib olish bo'yicha ekologik toza standartlarni qabul qildi",
        source: "Reuters Latin America",
        time: "1 soat oldin",
        category: "Xomashyo",
        summary: "Suv resurslarini asrovchi yangi to'g'ridan-to'g'ri litiy ajratish (DLE) texnologiyalari majburiy etib belgilandi."
      },
      {
        id: 'sa-ev-2',
        title: "Braziliya bio-yoqilg'i va barqaror qishloq xo'jaligi eksportida yangi rekord o'rnatdi",
        source: "Bloomberg",
        time: "3 soat oldin",
        category: "Iqtisodiyot",
        summary: "Etanol va soya eksporti Osiyo va Yevropa bozorlariga yetkazib berish hajmini oshirdi."
      }
    ],
    publicDebates: [
      {
        title: "Litiy qazib olish va tub aholi huquqlari",
        impactLevel: 'yuqori',
        description: "Atakama cho'li va tuz konlari atrofida yashovchi mahalliy jamoalar suv zaxiralarini muhofaza qilishni talab qilmoqda.",
        causes: [
          "Global akkumulyator ishlab chiqaruvchilarining litiyga kuchli talabi",
          "Tuzli ko'llardagi suv balansining o'zgarishi xavfi"
        ],
        publicReaction: "Davlatlar qazib olish daromadlarining bir qismini mahalliy infratuzilmaga ajratishni va'da qilmoqda."
      }
    ],
    keyIndicators: [
      { label: "Global litiy zaxiralari", value: "56%", trend: 'stable' },
      { label: "Bio-yoqilg'i ishlab chiqarish", value: "Top-2", trend: 'up' },
      { label: "Iqtisodiy o'sish", value: "+2.8%", trend: 'up' }
    ],
    youtubeVideos: [
      {
        id: '2A1B3C4D5eF',
        title: "The Battle for the Lithium Triangle in South America",
        channel: "Reuters Special",
        duration: "11:45",
        description: "Chili, Argentina va Boliviya global batareya bozorini qanday shakllantirmoqda.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "Litiy uchburchagi va toza energiya",
      "Amazonka o'rmonlarini asrash sammiti",
      "Mercosur va global savdo shartnomalari"
    ]
  },
  'oceania': {
    id: 'oceania',
    code: 'OC',
    name: "Avstraliya va Okeaniya",
    nativeName: "Australia & Pacific Island Forum",
    continent: "Okeaniya",
    headline: "Kritik minerallar eksporti, yashil vodorod va Tinch okeani iqlim sammiti",
    summary: "Avstraliya nodir tuproq elementlari, litiy, uran va qayta tiklanuvchi vodorod bo'yicha global yetkazib beruvchiga aylanmoqda. Tinch okeani orol davlatlari esa iqlim isishi va dengiz sathi ko'tarilishi oqibatlarini bartaraf etishni talab qilmoqda.",
    status: 'monitored',
    statusLabel: "Monitoringda // Yashil minerallar va okean xavfsizligi",
    activeEvents: [
      {
        id: 'oc-ev-1',
        title: "Avstraliya nodir tuproq metallari va litiy qayta ishlash zavodlarini kengaytirdi",
        source: "ABC News Australia",
        time: "1 soat oldin",
        category: "Minerallar",
        summary: "AQSH, Yaponiya va Janubiy Koreya bilan strategik minerallar bo'yicha uzoq muddatli xavfsizlik bitimi kuchga kirdi."
      }
    ],
    publicDebates: [
      {
        title: "Okean sathi ko'tarilishi va Tinch okeani orollari xavfsizligi",
        impactLevel: 'yuqori',
        description: "Tuvalu, Kiribati va Fiji davlatlari global issiqxona gazlarini zudlik bilan qisqartirishni talab qilmoqda.",
        causes: [
          "Muzliklar erishi natijasida qirg'oqbo'yi hududlarining suv ostida qolishi xavfi",
          "Xalqaro iqlim kompensatsiyalari fondining sekin ishlashi"
        ],
        publicReaction: "Orol davlatlari ekologik qochqinlar huquqini BMT darajasida tan olishni talab qilmoqda."
      }
    ],
    keyIndicators: [
      { label: "Nodir metallar eksporti", value: "Jahonda 2-o'rin", trend: 'up' },
      { label: "Quyosh energiyasidan foydalanish", value: "Uy xo'jaliklarining 34%", trend: 'up' },
      { label: "Iqtisodiy barqarorlik", value: "AAA Reyting", trend: 'stable' }
    ],
    youtubeVideos: [
      {
        id: '8f7e6d5c4bA',
        title: "Australia's Critical Minerals Push: The Green Tech Revolution",
        channel: "ABC News In-Depth",
        duration: "15:10",
        description: "Nodir tuproq elementlari va global toza energiya zanjiridagi Avstraliyaning o'rni.",
        published: "2026"
      }
    ],
    featuredTopics: [
      "Kritik minerallar va yashil vodorod",
      "Tinch okeani orollari va iqlim inqirozi",
      "Yangi Zelandiya va Avstraliya innovatsiyalari"
    ]
  }
};
