// Realistic 3D continent sampling points for the CyberGlobe3D hologram dot-matrix
export interface LandPoint {
  lat: number;
  lon: number;
  importance?: number;
}

export const CONTINENT_LAND_POINTS: LandPoint[] = [
  // 1. UZBEKISTAN & CENTRAL ASIA (Dense high-fidelity focus)
  { lat: 41.3, lon: 69.2, importance: 2.2 }, // Tashkent
  { lat: 39.6, lon: 66.9, importance: 2.0 }, // Samarkand
  { lat: 39.7, lon: 64.4, importance: 1.8 }, // Bukhara
  { lat: 40.5, lon: 70.9, importance: 1.8 }, // Fergana
  { lat: 41.5, lon: 60.6, importance: 1.8 }, // Khiva
  { lat: 42.4, lon: 59.6, importance: 1.8 }, // Nukus
  { lat: 43.2, lon: 76.9, importance: 1.9 }, // Almaty
  { lat: 51.1, lon: 71.4, importance: 1.9 }, // Astana
  { lat: 42.8, lon: 74.5, importance: 1.8 }, // Bishkek
  { lat: 38.5, lon: 68.7, importance: 1.8 }, // Dushanbe
  { lat: 37.9, lon: 58.3, importance: 1.8 }, // Ashgabat
  { lat: 40.0, lon: 65.0 },
  { lat: 44.0, lon: 68.0 },
  { lat: 46.0, lon: 72.0 },
  { lat: 48.0, lon: 66.0 },
  { lat: 42.0, lon: 62.0 },
  { lat: 45.0, lon: 60.0 },
  { lat: 43.0, lon: 55.0 },
  { lat: 47.0, lon: 55.0 },
  { lat: 50.0, lon: 60.0 },

  // 2. EAST ASIA & PACIFIC
  { lat: 37.5, lon: 127.0, importance: 2.2 }, // Seoul
  { lat: 35.6, lon: 139.7, importance: 2.2 }, // Tokyo
  { lat: 39.9, lon: 116.4, importance: 2.2 }, // Beijing
  { lat: 31.2, lon: 121.4, importance: 2.0 }, // Shanghai
  { lat: 25.0, lon: 121.5, importance: 2.0 }, // Taipei
  { lat: 22.3, lon: 114.1, importance: 1.8 }, // Hong Kong
  { lat: 35.0, lon: 105.0 },
  { lat: 30.0, lon: 110.0 },
  { lat: 28.0, lon: 115.0 },
  { lat: 34.0, lon: 118.0 },
  { lat: 42.0, lon: 125.0 },
  { lat: 45.0, lon: 130.0 },
  { lat: 38.0, lon: 140.0 },
  { lat: 43.0, lon: 142.0 },
  { lat: 33.0, lon: 131.0 },

  // 3. SOUTH ASIA & SOUTHEAST ASIA
  { lat: 28.6, lon: 77.2, importance: 2.0 }, // New Delhi
  { lat: 19.0, lon: 72.8, importance: 1.8 }, // Mumbai
  { lat: 13.0, lon: 80.2 },
  { lat: 22.5, lon: 88.3 },
  { lat: 1.3, lon: 103.8, importance: 2.0 }, // Singapore
  { lat: 13.7, lon: 100.5 }, // Bangkok
  { lat: 10.8, lon: 106.6 }, // Ho Chi Minh
  { lat: -6.2, lon: 106.8 }, // Jakarta
  { lat: 3.1, lon: 101.6 },
  { lat: 14.5, lon: 120.9 }, // Manila
  { lat: 24.8, lon: 67.0 }, // Karachi
  { lat: 31.5, lon: 74.3 }, // Lahore

  // 4. EUROPE
  { lat: 50.8, lon: 4.3, importance: 2.2 }, // Brussels
  { lat: 51.5, lon: -0.1, importance: 2.2 }, // London
  { lat: 48.8, lon: 2.3, importance: 2.0 }, // Paris
  { lat: 52.5, lon: 13.4, importance: 2.0 }, // Berlin
  { lat: 41.9, lon: 12.5, importance: 1.8 }, // Rome
  { lat: 40.4, lon: -3.7, importance: 1.8 }, // Madrid
  { lat: 59.3, lon: 18.0 }, // Stockholm
  { lat: 52.3, lon: 4.9 }, // Amsterdam
  { lat: 55.7, lon: 37.6, importance: 1.9 }, // Moscow
  { lat: 50.4, lon: 30.5 }, // Kyiv
  { lat: 52.2, lon: 21.0 }, // Warsaw
  { lat: 48.2, lon: 16.3 }, // Vienna
  { lat: 47.4, lon: 19.0 }, // Budapest
  { lat: 44.4, lon: 26.1 }, // Bucharest
  { lat: 37.9, lon: 23.7 }, // Athens
  { lat: 60.1, lon: 24.9 }, // Helsinki
  { lat: 59.9, lon: 10.7 }, // Oslo
  { lat: 45.0, lon: 10.0 },
  { lat: 46.0, lon: 2.0 },
  { lat: 54.0, lon: -2.0 },
  { lat: 53.0, lon: 9.0 },

  // 5. MIDDLE EAST & CAUCASUS & TURKEY
  { lat: 41.0, lon: 28.9, importance: 2.1 }, // Istanbul
  { lat: 39.9, lon: 32.8 }, // Ankara
  { lat: 40.4, lon: 49.8, importance: 2.0 }, // Baku
  { lat: 41.7, lon: 44.8 }, // Tbilisi
  { lat: 40.1, lon: 44.5 }, // Yerevan
  { lat: 25.2, lon: 55.3, importance: 2.2 }, // Dubai
  { lat: 24.7, lon: 46.6, importance: 2.0 }, // Riyadh
  { lat: 35.6, lon: 51.3, importance: 2.0 }, // Tehran
  { lat: 33.3, lon: 44.3 }, // Baghdad
  { lat: 31.7, lon: 35.2 }, // Jerusalem
  { lat: 29.3, lon: 47.9 }, // Kuwait
  { lat: 25.3, lon: 51.5 }, // Doha
  { lat: 23.6, lon: 58.5 }, // Muscat
  { lat: 32.0, lon: 36.0 },

  // 6. NORTH AMERICA
  { lat: 38.9, lon: -77.0, importance: 2.2 }, // Washington D.C.
  { lat: 40.7, lon: -74.0, importance: 2.2 }, // New York
  { lat: 37.7, lon: -122.4, importance: 2.2 }, // San Francisco / Silicon Valley
  { lat: 34.0, lon: -118.2, importance: 2.0 }, // Los Angeles
  { lat: 41.8, lon: -87.6, importance: 1.8 }, // Chicago
  { lat: 29.7, lon: -95.3 }, // Houston
  { lat: 47.6, lon: -122.3, importance: 1.9 }, // Seattle
  { lat: 45.4, lon: -75.7 }, // Ottawa
  { lat: 43.6, lon: -79.3, importance: 1.8 }, // Toronto
  { lat: 49.2, lon: -123.1 }, // Vancouver
  { lat: 19.4, lon: -99.1, importance: 1.8 }, // Mexico City
  { lat: 32.0, lon: -100.0 },
  { lat: 36.0, lon: -85.0 },
  { lat: 35.0, lon: -115.0 },
  { lat: 42.0, lon: -105.0 },
  { lat: 48.0, lon: -100.0 },
  { lat: 55.0, lon: -115.0 },
  { lat: 58.0, lon: -100.0 },
  { lat: 62.0, lon: -140.0 },
  { lat: 64.0, lon: -150.0 },

  // 7. SOUTH AMERICA
  { lat: -23.5, lon: -46.6, importance: 2.0 }, // Sao Paulo
  { lat: -34.6, lon: -58.3, importance: 1.9 }, // Buenos Aires
  { lat: -33.4, lon: -70.6 }, // Santiago
  { lat: -12.0, lon: -77.0 }, // Lima
  { lat: 4.7, lon: -74.0 }, // Bogota
  { lat: -15.8, lon: -47.9 }, // Brasilia
  { lat: -22.9, lon: -43.1 }, // Rio de Janeiro
  { lat: -3.0, lon: -60.0 }, // Amazon
  { lat: -10.0, lon: -50.0 },
  { lat: -18.0, lon: -55.0 },
  { lat: -28.0, lon: -65.0 },
  { lat: -40.0, lon: -68.0 },
  { lat: -50.0, lon: -72.0 },

  // 8. AFRICA
  { lat: 30.0, lon: 31.2, importance: 2.0 }, // Cairo
  { lat: -1.3, lon: 36.8, importance: 2.0 }, // Nairobi
  { lat: 6.5, lon: 3.3, importance: 1.9 }, // Lagos
  { lat: -26.2, lon: 28.0, importance: 1.9 }, // Johannesburg
  { lat: -33.9, lon: 18.4 }, // Cape Town
  { lat: 9.0, lon: 38.7 }, // Addis Ababa
  { lat: 33.5, lon: -7.6 }, // Casablanca
  { lat: 36.8, lon: 10.1 }, // Tunis
  { lat: 14.7, lon: -17.4 }, // Dakar
  { lat: 0.0, lon: 20.0 }, // Congo Basin
  { lat: 12.0, lon: 15.0 },
  { lat: 20.0, lon: 10.0 }, // Sahara
  { lat: 22.0, lon: 25.0 },
  { lat: -10.0, lon: 25.0 },
  { lat: -18.0, lon: 30.0 },

  // 9. AUSTRALIA & OCEANIA
  { lat: -33.8, lon: 151.2, importance: 2.0 }, // Sydney
  { lat: -37.8, lon: 144.9, importance: 1.8 }, // Melbourne
  { lat: -31.9, lon: 115.8 }, // Perth
  { lat: -27.4, lon: 153.0 }, // Brisbane
  { lat: -41.2, lon: 174.7 }, // Wellington
  { lat: -25.0, lon: 133.0 }, // Outback
  { lat: -20.0, lon: 140.0 },
  { lat: -30.0, lon: 125.0 },
  { lat: -15.0, lon: 130.0 },
  { lat: -35.0, lon: 138.0 },

  // 10. SIBERIA & NORTHERN EURASIA
  { lat: 55.0, lon: 82.9 }, // Novosibirsk
  { lat: 56.8, lon: 60.6 }, // Yekaterinburg
  { lat: 52.3, lon: 104.3 }, // Irkutsk
  { lat: 43.1, lon: 131.9 }, // Vladivostok
  { lat: 60.0, lon: 70.0 },
  { lat: 62.0, lon: 100.0 },
  { lat: 65.0, lon: 130.0 },
  { lat: 68.0, lon: 160.0 }
];
