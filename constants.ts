import { InventoryStatus, Product, UserProfile, Promotion } from './types';

export const CHANNELS = ['Mobile App', 'Web Store', 'In-Store Kiosk', 'WhatsApp'] as const;

export const MOCK_USERS: UserProfile[] = [
  {
    "id": "c001",
    "name": "Ava Patel",
    "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    "visual_description": "A professional Indian woman in her late 20s, shoulder-length black hair, minimal makeup, elegant posture",
    "loyalty_tier": "Platinum",
    "location": "NYC-10011",
    "device_pref": ["mobile", "whatsapp"],
    "style_focus": ["minimal", "occasion"],
    "budget": "150-300",
    "purchase_history": [
        {"sku": "DRESS-CRV-01", "date": "2024-11-22", "channel": "web", "value": 220, "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200"},
        {"sku": "ACC-BAG-01", "date": "2024-10-15", "channel": "in_store", "value": 450}
    ],
    "aov": 335,
    "preferences": {"fit": "petite", "colors": ["black", "emerald"], "sizes": {"dress": "4", "shoe": "7"}},
    "measurements": { "height": "5'4\"", "weight": "120lbs", "bust": "34B", "waist": "26", "hips": "36", "shoe": "7" },
    "payment_methods": [
        { "id": "pm_1", "type": "visa", "last4": "4242", "expiry": "12/26" },
        { "id": "pm_2", "type": "amex", "last4": "1005", "expiry": "09/25" }
    ]
  },
  {
    "id": "c002",
    "name": "Liam Chen",
    "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    "visual_description": "A trendy Asian man in his early 30s, short faded haircut, wearing stylish glasses, casual confident look",
    "loyalty_tier": "Gold",
    "location": "SF-94107",
    "device_pref": ["mobile", "kiosk"],
    "style_focus": ["athleisure", "commuter"],
    "budget": "80-180",
    "purchase_history": [
        {"sku": "SNEAK-URB-02", "date": "2024-11-15", "channel": "in_store", "value": 140, "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"},
        {"sku": "TEE-GRF-03", "date": "2024-09-10", "channel": "mobile", "value": 70}
    ],
    "aov": 105,
    "preferences": {"fit": "regular", "colors": ["navy", "gray"], "sizes": {"top": "M", "shoe": "10"}},
    "measurements": { "height": "5'10\"", "weight": "170lbs", "waist": "32", "shoe": "10" },
    "payment_methods": [
        { "id": "pm_3", "type": "mastercard", "last4": "8899", "expiry": "01/27" }
    ]
  },
  {
    "id": "c011",
    "name": "Zara X",
    "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    "visual_description": "An avant-garde fashion influencer, sharp bob haircut with neon streaks, bold makeup, futuristic vibe",
    "loyalty_tier": "Platinum",
    "location": "LA-90210",
    "device_pref": ["app", "instagram"],
    "style_focus": ["avant-garde", "street-luxe"],
    "budget": "400-1200",
    "purchase_history": [
        {"sku": "ACC-SUN-01", "date": "2024-11-28", "channel": "app", "value": 320},
        {"sku": "DRESS-CRV-02", "date": "2024-11-01", "channel": "web", "value": 420},
        {"sku": "BOOT-LTH-02", "date": "2024-10-15", "channel": "web", "value": 240}
    ],
    "aov": 326,
    "preferences": {"fit": "oversized", "colors": ["neon-green", "matte-black"], "sizes": {"top": "L", "shoe": "8"}},
    "measurements": { "height": "5'9\"", "weight": "135lbs", "bust": "34C", "waist": "27", "hips": "37", "shoe": "8" },
    "payment_methods": [
        { "id": "pm_4", "type": "visa", "last4": "1111", "expiry": "11/28" },
        { "id": "pm_5", "type": "mastercard", "last4": "5555", "expiry": "05/26" }
    ]
  },
  {
    "id": "c003",
    "name": "Sofia Rivera",
    "photoUrl": "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=200",
    "visual_description": "A sophisticated Latina woman, long wavy hair, elegant resort style, warm complexion",
    "loyalty_tier": "Platinum",
    "location": "MIA-33130",
    "device_pref": ["app", "voice"],
    "style_focus": ["resort", "evening"],
    "budget": "200-450",
    "purchase_history": [
        {"sku": "DRESS-SLK-03", "date": "2024-11-02", "channel": "mobile", "value": 380, "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=200"}
    ],
    "aov": 380,
    "preferences": {"fit": "tall", "colors": ["coral", "ivory"], "sizes": {"dress": "6", "heel": "8"}},
    "measurements": { "height": "5'8\"", "weight": "130lbs", "bust": "36B", "waist": "28", "hips": "38", "shoe": "8" },
    "payment_methods": [
         { "id": "pm_6", "type": "amex", "last4": "3003", "expiry": "03/25" }
    ]
  },
  {
    "id": "c004",
    "name": "Noah Williams",
    "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    "visual_description": "A handsome man in his late 30s, stubble beard, wearing a linen shirt, relaxed yet put together",
    "loyalty_tier": "Silver",
    "location": "LA-90014",
    "device_pref": ["web", "telegram"],
    "style_focus": ["smart casual", "travel"],
    "budget": "120-260",
    "purchase_history": [
         {"sku": "BLAZR-LIN-01", "date": "2024-10-28", "channel": "web", "value": 260}
    ],
    "aov": 185,
    "preferences": {"fit": "slim", "colors": ["sand", "olive"], "sizes": {"blazer": "40R", "shoe": "9"}},
    "measurements": { "height": "6'0\"", "weight": "180lbs", "waist": "33", "shoe": "9" },
    "payment_methods": [
         { "id": "pm_7", "type": "visa", "last4": "8080", "expiry": "07/26" }
    ]
  },
  {
    "id": "c005",
    "name": "Mia Thompson",
    "photoUrl": "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=200",
    "visual_description": "A focused woman with glasses and a messy bun, wearing a cozy knit sweater, working on a laptop",
    "loyalty_tier": "Gold",
    "location": "CHI-60611",
    "device_pref": ["mobile", "web"],
    "style_focus": ["office", "weekend"],
    "budget": "100-220",
    "purchase_history": [
         {"sku": "KNIT-SFT-02", "date": "2024-11-18", "channel": "app", "value": 130}
    ],
    "aov": 150,
    "preferences": {"fit": "regular", "colors": ["camel", "cream"], "sizes": {"top": "S", "shoe": "8"}},
    "measurements": { "height": "5'5\"", "weight": "125lbs", "bust": "34A", "waist": "27", "hips": "37", "shoe": "8" },
    "payment_methods": [
         { "id": "pm_8", "type": "mastercard", "last4": "2233", "expiry": "10/25" }
    ]
  },
  {
    "id": "c006",
    "name": "Ethan Ross",
    "photoUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    "visual_description": "Rugged man with a beard, beanie hat, wearing outdoor gear, background of pine trees",
    "loyalty_tier": "Bronze",
    "location": "SEA-98101",
    "device_pref": ["voice", "web"],
    "style_focus": ["outdoor", "layering"],
    "budget": "90-200",
    "purchase_history": [
        {"sku": "JACK-PRF-01", "date": "2024-10-10", "channel": "voice", "value": 175}
    ],
    "aov": 140,
    "preferences": {"fit": "regular", "colors": ["forest", "charcoal"], "sizes": {"jacket": "L", "shoe": "11"}},
    "measurements": { "height": "6'1\"", "weight": "190lbs", "waist": "34", "shoe": "11" },
    "payment_methods": [
        { "id": "pm_9", "type": "visa", "last4": "0099", "expiry": "04/27" }
    ]
  },
  {
    "id": "c007",
    "name": "Chloe Martin",
    "photoUrl": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=200",
    "visual_description": "Smiling woman with long blonde hair, wearing a denim jacket, sunny outdoor setting",
    "loyalty_tier": "Platinum",
    "location": "DAL-75201",
    "device_pref": ["whatsapp", "app"],
    "style_focus": ["denim", "casual"],
    "budget": "70-160",
    "purchase_history": [
        {"sku": "DENIM-HG-01", "date": "2024-11-05", "channel": "whatsapp", "value": 120}
    ],
    "aov": 110,
    "preferences": {"fit": "curvy", "colors": ["indigo", "white"], "sizes": {"denim": "28", "top": "M"}},
    "measurements": { "height": "5'6\"", "weight": "140lbs", "bust": "36C", "waist": "29", "hips": "40", "shoe": "8.5" },
    "payment_methods": [
        { "id": "pm_10", "type": "amex", "last4": "1234", "expiry": "01/26" }
    ]
  },
  {
    "id": "c008",
    "name": "James O'Connor",
    "photoUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
    "visual_description": "Man with silvering hair, wearing a leather jacket and scarf, urban brick background",
    "loyalty_tier": "Silver",
    "location": "BOS-02116",
    "device_pref": ["mobile", "web"],
    "style_focus": ["heritage", "workwear"],
    "budget": "110-250",
    "purchase_history": [
        {"sku": "BOOT-LTH-02", "date": "2024-09-30", "channel": "web", "value": 240}
    ],
    "aov": 175,
    "preferences": {"fit": "wide", "colors": ["cognac", "navy"], "sizes": {"boot": "10W", "top": "L"}},
    "measurements": { "height": "5'11\"", "weight": "200lbs", "waist": "36", "shoe": "10.5" },
    "payment_methods": [
        { "id": "pm_11", "type": "mastercard", "last4": "5678", "expiry": "08/25" }
    ]
  },
  {
    "id": "c009",
    "name": "Isabella Rossi",
    "photoUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    "visual_description": "Woman with sleek black hair, red lipstick, wearing an evening gown, looking over shoulder",
    "loyalty_tier": "Gold",
    "location": "AUS-73301",
    "device_pref": ["app", "kiosk"],
    "style_focus": ["occasion", "designer collabs"],
    "budget": "250-600",
    "purchase_history": [
        {"sku": "DRESS-CRV-02", "date": "2024-11-08", "channel": "mobile", "value": 420}
    ],
    "aov": 360,
    "preferences": {"fit": "curvy", "colors": ["ruby", "midnight"], "sizes": {"dress": "10", "heel": "9"}},
    "measurements": { "height": "5'7\"", "weight": "145lbs", "bust": "36D", "waist": "30", "hips": "41", "shoe": "9" },
    "payment_methods": [
        { "id": "pm_12", "type": "visa", "last4": "9988", "expiry": "12/27" }
    ]
  },
  {
    "id": "c010",
    "name": "Oliver Smith",
    "photoUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    "visual_description": "Young man with curly hair, wearing a graphic tee and cap, holding a skateboard",
    "loyalty_tier": "Bronze",
    "location": "PHX-85004",
    "device_pref": ["telegram", "web"],
    "style_focus": ["streetwear", "capsule"],
    "budget": "60-140",
    "purchase_history": [
        {"sku": "TEE-GRF-03", "date": "2024-11-12", "channel": "telegram", "value": 70}
    ],
    "aov": 90,
    "preferences": {"fit": "relaxed", "colors": ["black", "sage"], "sizes": {"top": "M", "sneaker": "9"}},
    "measurements": { "height": "5'9\"", "weight": "155lbs", "waist": "30", "shoe": "9" },
    "payment_methods": [
         { "id": "pm_13", "type": "visa", "last4": "4321", "expiry": "06/25" }
    ]
  }
];

export const MOCK_INVENTORY: Record<string, InventoryStatus> = {
  "DRESS-CRV-01": {"online": 24, "store_nyc": 5, "store_sf": 2, "store_mia": 4, "store_austin": 1},
  "DRESS-CRV-02": {"online": 6, "store_nyc": 0, "store_sf": 1, "store_mia": 3, "store_dallas": 0},
  "SNEAK-URB-02": {"online": 40, "store_sf": 6, "store_nyc": 8, "store_seattle": 5},
  "DRESS-SLK-03": {"online": 8, "store_mia": 5, "store_sf": 0, "store_nyc": 2},
  "BLAZR-LIN-01": {"online": 15, "store_la": 5, "store_nyc": 4, "store_chicago": 3},
  "KNIT-SFT-02": {"online": 35, "store_chicago": 8, "store_nyc": 6, "store_boston": 5},
  "DENIM-HG-01": {"online": 50, "store_dallas": 10, "store_nyc": 7, "store_la": 9},
  "BOOT-LTH-02": {"online": 12, "store_boston": 4, "store_denver": 3, "store_nyc": 2},
  "JACK-PRF-01": {"online": 18, "store_seattle": 6, "store_denver": 5, "store_sf": 3},
  "TEE-GRF-03": {"online": 80, "store_phoenix": 12, "store_nyc": 10, "store_sf": 8},
  "ACC-BAG-01": {"online": 10, "store_nyc": 3, "store_la": 4, "store_mia": 2},
  "ACC-SUN-01": {"online": 25, "store_la": 8, "store_mia": 6, "store_sf": 5},
  "ACC-WATCH-01": {"online": 15, "store_sf": 5, "store_nyc": 2, "store_seattle": 3},
  "YOGA-SET-01": {"online": 30, "store_la": 10, "store_sf": 5, "store_austin": 8},
  "JACK-BOMB-01": {"online": 20, "store_nyc": 5, "store_chicago": 4, "store_boston": 3},
  "ACC-WEEK-01": {"online": 8, "store_la": 2, "store_mia": 1, "store_dallas": 2}
};

export const MOCK_PRODUCTS: Product[] = [
  {
    "sku": "DRESS-CRV-01",
    "name": "Curve Satin Midi Dress",
    "category": "dresses",
    "attributes": {"fit": "curve", "fabric": "satin", "occasion": "evening", "colorways": ["black", "emerald"]},
    "price": 220,
    "images": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400"],
    "tags": ["bundle:satin-set", "promo:holiday25"]
  },
  {
    "sku": "DRESS-CRV-02",
    "name": "Curve One-Shoulder Gown",
    "category": "dresses",
    "attributes": {"fit": "curve", "fabric": "crepe", "occasion": "event", "colorways": ["ruby", "midnight"]},
    "price": 420,
    "images": ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=400"],
    "tags": ["bundle:satin-set"]
  },
  {
    "sku": "SNEAK-URB-02",
    "name": "Urban Runner Sneaker",
    "category": "footwear",
    "attributes": {"style": "athleisure", "upper": "mesh", "colorways": ["navy", "gray"], "waterproof": true},
    "price": 140,
    "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400"],
    "tags": ["promo:bundle-commuter"]
  },
  {
    "sku": "DRESS-SLK-03",
    "name": "Silk Bias Slip Dress",
    "category": "dresses",
    "attributes": {"fabric": "silk", "occasion": "resort", "colorways": ["coral", "ivory"]},
    "price": 380,
    "images": ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=400"],
    "tags": ["promo:holiday25"]
  },
  {
    "sku": "BLAZR-LIN-01",
    "name": "Linen Blend Blazer",
    "category": "tailoring",
    "attributes": {"fit": "slim", "season": "spring", "colorways": ["sand", "olive"]},
    "price": 260,
    "images": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400"],
    "tags": ["bundle:travel-pack"]
  },
  {
    "sku": "KNIT-SFT-02",
    "name": "Soft Touch Mockneck",
    "category": "knitwear",
    "attributes": {"fit": "regular", "fabric": "cashmere blend", "colorways": ["camel", "cream"]},
    "price": 130,
    "images": ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400"],
    "tags": ["promo:bundle-office"]
  },
  {
    "sku": "DENIM-HG-01",
    "name": "High-Rise Sculpt Denim",
    "category": "denim",
    "attributes": {"fit": "curvy", "wash": "indigo", "stretch": "high"},
    "price": 120,
    "images": ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400"],
    "tags": ["promo:bundle-denim"]
  },
  {
    "sku": "BOOT-LTH-02",
    "name": "Heritage Leather Boot",
    "category": "footwear",
    "attributes": {"upper": "full-grain leather", "waterproof": true, "colorways": ["cognac", "black"]},
    "price": 240,
    "images": ["https://images.unsplash.com/photo-1608256246200-53e635b5b69f?auto=format&fit=crop&q=80&w=400"],
    "tags": ["promo:winter-kit"]
  },
  {
    "sku": "JACK-PRF-01",
    "name": "Performance Shell Jacket",
    "category": "outerwear",
    "attributes": {"waterproof": true, "insulation": "light", "colorways": ["forest", "charcoal"]},
    "price": 175,
    "images": ["https://images.unsplash.com/photo-1544022613-e87ca19202d8?auto=format&fit=crop&q=80&w=400"],
    "tags": ["bundle:outdoor-layer"]
  },
  {
    "sku": "TEE-GRF-03",
    "name": "Graphic Capsule Tee",
    "category": "tops",
    "attributes": {"fit": "relaxed", "colorways": ["black", "sage"], "material": "organic cotton"},
    "price": 70,
    "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400"],
    "tags": ["promo:street-set"]
  },
  {
    "sku": "ACC-BAG-01",
    "name": "Structured Tote Mini",
    "category": "accessories",
    "attributes": {"material": "vegan leather", "colorways": ["cream", "onyx"], "size": "mini"},
    "price": 450,
    "images": ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400"],
    "tags": ["trend:minimalist"]
  },
  {
    "sku": "ACC-SUN-01",
    "name": "Cyber Shield Sunglasses",
    "category": "accessories",
    "attributes": {"style": "shield", "lens": "mirrored", "colorways": ["silver", "chrome"]},
    "price": 320,
    "images": ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400"],
    "tags": ["trend:y2k-future"]
  },
  {
    "sku": "ACC-WATCH-01",
    "name": "Chronograph Tech Watch",
    "category": "accessories",
    "attributes": {"material": "titanium", "style": "modern", "feature": "smart-hybrid"},
    "price": 299,
    "images": ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=400"],
    "tags": ["gift:tech-lover"]
  },
  {
    "sku": "YOGA-SET-01",
    "name": "Seamless Sculpt Yoga Set",
    "category": "activewear",
    "attributes": {"fabric": "nylon-spandex", "fit": "compression", "colorways": ["lavender", "mint"]},
    "price": 95,
    "images": ["https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"],
    "tags": ["activity:yoga"]
  },
  {
    "sku": "JACK-BOMB-01",
    "name": "Vintage Wash Bomber",
    "category": "outerwear",
    "attributes": {"style": "street", "fabric": "satin-touch", "colorways": ["olive", "burgundy"]},
    "price": 185,
    "images": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400"],
    "tags": ["trend:retro"]
  },
  {
    "sku": "ACC-WEEK-01",
    "name": "Leather Weekender Bag",
    "category": "accessories",
    "attributes": {"material": "full-grain leather", "size": "large", "colorways": ["whiskey", "black"]},
    "price": 350,
    "images": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400"],
    "tags": ["travel:essential"]
  }
];

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    "code": "HOLIDAY25",
    "description": "25% off dresses and occasionwear",
    "discount_type": "percent",
    "value": 25,
    "applicable_categories": ["dresses"],
    "tiers": ["Gold", "Platinum"],
    "start": "2024-11-01",
    "end": "2024-12-31",
    "stackable": false
  },
  {
    "code": "BUNDLE-COMMUTER",
    "description": "Sneaker + shell jacket bundle save $40",
    "discount_type": "fixed",
    "value": 40,
    "bundle_skus": ["SNEAK-URB-02", "JACK-PRF-01"],
    "tiers": ["Bronze", "Silver", "Gold", "Platinum"],
    "start": "2024-01-01",
    "end": "2024-12-31",
    "stackable": true
  },
  {
    "code": "LOYALTY-BONUS-50",
    "description": "Automatic $50 off for Platinum members once per month",
    "discount_type": "fixed",
    "value": 50,
    "tiers": ["Platinum"],
    "frequency": "monthly",
    "start": "2024-01-01",
    "end": "2024-12-31",
    "stackable": true
  },
  {
    "code": "WINTER-KIT",
    "description": "Boot + knit bundle saves 15%",
    "discount_type": "percent",
    "value": 15,
    "bundle_skus": ["BOOT-LTH-02", "KNIT-SFT-02"],
    "tiers": ["Silver", "Gold", "Platinum"],
    "start": "2024-01-01",
    "end": "2024-12-31",
    "stackable": true
  }
];