import 'dotenv/config';
import prisma from './prisma.js';

const sampleData = [
  {
    artisan: {
      phone: '+919876543201',
      firebaseUid: 'seed_artisan_1',
      displayName: 'सुनीता देवी (Sunita Devi)',
      craftType: 'Block Print Textiles',
      village: 'Sanganer',
      city: 'Jaipur',
      state: 'Rajasthan',
      yearsExperience: 22,
      bio: 'विगत 22 वर्षों से प्राकृतिक रंगों और शीशम की लकड़ी के छापों से पारंपरिक सांगानेरी ब्लॉक प्रिंटिंग कर रही हूँ।',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543201',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'पारंपरिक सांगानेरी ब्लॉक-प्रिंट सूती चादर',
      tagline: 'शुद्ध सूती कपड़े पर प्राकृतिक रंगों से हाथ से छापा गया बेजोड़ कला-शिल्प।',
      category: 'Textiles',
      priceInr: 1250.00,
      spokenLanguage: 'hi',
      material: '100% Pure Organic Cotton',
      technique: 'Hand block printing using hand-carved teak wood blocks',
      dimensions: '90 x 108 inches (King Size)',
      colors: 'Indigo blue, turmeric yellow, madder red',
      timeToMake: '4 days',
      uses: 'Bedspread, living room throw, festive gifting',
      story: 'सांगानेर की 400 साल पुरानी पारंपरिक बगरू-सांगानेरी शैली, जिसमें प्राकृतिक गोंद और वनस्पतियों के रंगों का उपयोग होता है।',
      care: 'Gentle hand wash in cold water with mild detergent; dry in shade',
      tags: ['handblockprint', 'cotton', 'sanganeri', 'rajasthan', 'bedsheet'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1606744888344-498238f01037?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1606744888344-498238f01037?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'hi',
          tone: 'traditional',
          title: 'हस्तनिर्मित सांगानेरी ब्लॉक प्रिंट सूती चादर',
          tagline: 'राजस्थान की समृद्ध परंपरा और हस्तशिल्प का प्रतीक।',
          body: 'यह खूबसूरत चादर 100% शुद्ध कॉटन पर पारंपरिक लकड़ी के ठप्पों से हाथ से छापी गई है। इसमें इस्तेमाल किए गए रंग प्राकृतिक वनस्पतियों से तैयार किए जाते हैं जो त्वचा के लिए सुरक्षित और टिकाऊ हैं। सांगानेरी प्रिंटिंग की हर छाप में पीढ़ियों का हुनर झलकता है। इसका आकार 90 गुणा 108 इंच है, जो बड़े पलंग के लिए बिल्कुल उपयुक्त है। घर को पारंपरिक सौम्यता देने या किसी विशेष को उपहार में देने के लिए यह एक उत्कृष्ट पसंद है।'
        },
        {
          language: 'en',
          tone: 'traditional',
          title: 'Authentic Sanganeri Hand-Block Printed Cotton Bedspread',
          tagline: 'Artisanal king-size bedding handcrafted with natural botanical dyes.',
          body: 'Handcrafted in the historic artisan hub of Sanganer, Jaipur, this king-size bedspread represents over four centuries of block-printing mastery. Every intricate floral motif is stamped entirely by hand using carved teakwood blocks. Crafted from 100% breathable organic cotton and dyed with gentle plant extracts, it provides both luxurious comfort and timeless heritage elegance. Measuring 90 by 108 inches, it drapes gracefully over king and queen beds alike.'
        }
      ]
    }
  },
  {
    artisan: {
      phone: '+919876543202',
      firebaseUid: 'seed_artisan_2',
      displayName: 'रमेश कुम्हार (Ramesh Prajapati)',
      craftType: 'Terracotta Pottery',
      village: 'Molela',
      city: 'Rajsamand',
      state: 'Rajasthan',
      yearsExperience: 30,
      bio: 'मोलेला की प्रसिद्ध मिट्टी के भित्ति-शिल्प और मटकों के पारंपरिक सिद्धहस्त मूर्तिकार।',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543202',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'पारंपरिक टेराकोटा नक्काशीदार जलपात्र (सुराही)',
      tagline: 'शुद्ध लाल मिट्टी से चाक पर गढ़ी गई शीतल जल सुराही।',
      category: 'Pottery',
      priceInr: 650.00,
      spokenLanguage: 'hi',
      material: 'Natural Red Clay / Terracotta',
      technique: 'Wheel-thrown & hand-etched geometric motifs',
      dimensions: '12 inches height, 7 inches diameter',
      colors: 'Earthy terracotta brown with natural white clay slip',
      timeToMake: '2 days',
      uses: 'Natural water cooling, home decor, eco-friendly living',
      story: 'मोलेला के पारंपरिक कुम्हारों द्वारा बनास नदी की चिकनी मिट्टी से तैयार, जो पानी को बिना बिजली प्राकृतिक रूप से ठंडा रखती है।',
      care: 'Clean with warm water and soft sponge. Do not use chemical soap inside.',
      tags: ['terracotta', 'pottery', 'claypot', 'ecofriendly', 'traditional'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'hi',
          tone: 'traditional',
          title: 'हस्तनिर्मित मोलेला टेराकोटा सुराही',
          tagline: 'प्रकृति की गोद से निकला शीतल और स्वास्थ्यवर्धक जलपात्र।',
          body: 'यह सुराही शुद्ध लाल मिट्टी से कुम्हार के चाक पर बनाई गई है। इसके बाहरी हिस्से पर हाथों से बारीक नक्काशी की गई है। मिट्टी के सूक्ष्म छिद्र पानी को प्राकृतिक वाष्पीकरण द्वारा ठंडा और सुवासित रखते हैं। यह प्लास्टिक मुक्त और पर्यावरण अनुकूल जीवनशैली के लिए एक उत्तम साधन है। घर के मंदिर, रसोई या बैठक कक्ष की सुंदरता बढ़ाने के लिए यह लाजवाब है।'
        },
        {
          language: 'en',
          tone: 'traditional',
          title: 'Handcrafted Terracotta Water Vessel (Surahi)',
          tagline: 'Artisanal wheel-thrown clay pitcher for natural mineral-rich cooling.',
          body: 'Sculpted on the traditional potter wheel using fertile river clay from Molela, this handcrafted Surahi is a marvel of sustainable ancient design. Its micro-porous walls cool drinking water naturally through evaporation, infusing it with subtle earthy minerals and alkalinity. Finished with delicate hand-carved floral etchings, it stands 12 inches tall and serves as both functional tableware and a rustic decor accent.'
        }
      ]
    }
  },
  {
    artisan: {
      phone: '+919876543203',
      firebaseUid: 'seed_artisan_3',
      displayName: 'गुरप्रीत सिंह (Gurpreet Singh)',
      craftType: 'Phulkari Embroidery',
      village: 'Tripuri',
      city: 'Patiala',
      state: 'Punjab',
      yearsExperience: 18,
      bio: 'ਪਟਿਆਲਾ ਦੀ ਮਸ਼ਹੂਰ ਪਰੰਪਰਾਗਤ ਰੇਸ਼ਮੀ ਫੁਲਕਾਰੀ ਅਤੇ ਦੁਪੱਟੇ ਤਿਆਰ ਕਰਨ ਵਾਲੇ ਸ਼ਿਲਪਕਾਰ।',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543203',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'ਹੱਥ ਨਾਲ ਕੱਢਿਆ ਰੇਸ਼ਮੀ ਬਾਗ਼ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ',
      tagline: 'ਸ਼ੁੱਧ ਖੱਦਰ ਤੇ ਪੱਟ ਦੇ ਧਾਗੇ ਨਾਲ ਕੱਢੀ ਪੰਜਾਬ ਦੀ ਪੁਰਾਤਨ ਵਿਰਾਸਤ।',
      category: 'Textiles',
      priceInr: 2800.00,
      spokenLanguage: 'pa',
      material: 'Handloom Khaddar base with untwisted silk floss (Pat)',
      technique: 'Darning stitch embroidered from the reverse side of fabric',
      dimensions: '2.5 meters length, 40 inches width',
      colors: 'Rust red, mustard yellow, bright green, turquoise',
      timeToMake: '12 days',
      uses: 'Festive wear, weddings, cultural celebrations',
      story: 'ਫੁਲਕਾਰੀ ਦਾ ਅਰਥ ਹੈ "ਫੁੱਲਾਂ ਦਾ ਕੰਮ"। ਇਹ ਪੰਜਾਬ ਦੇ ਸੱਭਿਆਚਾਰ ਵਿੱਚ ਵਿਆਹਾਂ ਅਤੇ ਤਿਉਹਾਰਾਂ ਤੇ ਸ਼ਗਨ ਮੰਨੀ ਜਾਂਦੀ ਹੈ।',
      care: 'Dry clean only. Store wrapped in soft muslin cloth.',
      tags: ['phulkari', 'punjab', 'handembroidery', 'dupatta', 'silk'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'pa',
          tone: 'traditional',
          title: 'ਪਰੰਪਰਾਗਤ ਹੱਥ-ਕਢਾਈ ਬਾਗ਼ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ',
          tagline: 'ਪੰਜਾਬੀ ਵਿਰਸੇ ਅਤੇ ਰੇਸ਼ਮੀ ਕਸੀਦਾਕਾਰੀ ਦਾ ਅਨਮੋਲ ਨਮੂਨਾ।',
          body: 'ਇਹ ਖ਼ੂਬਸੂਰਤ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ ਪਟਿਆਲੇ ਦੇ ਕਾਰੀਗਰਾਂ ਵੱਲੋਂ ਸ਼ੁੱਧ ਖੱਦਰ ਦੇ ਕੱਪੜੇ ਉੱਤੇ ਚਮਕਦਾਰ ਰੇਸ਼ਮੀ ਧਾਗਿਆਂ ਨਾਲ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ। ਇਸ ਵਿਚਲੇ ਜਿਓਮੈਟ੍ਰਿਕ ਫੁੱਲਾਂ ਦੇ ਨਮੂਨੇ ਪੰਜਾਬ ਦੀ ਖੇਤੀਬਾੜੀ ਅਤੇ ਖੁਸ਼ਹਾਲੀ ਦੀ ਕਹਾਣੀ ਬਿਆਨ ਕਰਦੇ ਹਨ। 2.5 ਮੀਟਰ ਲੰਬਾਈ ਵਾਲਾ ਇਹ ਦੁਪੱਟਾ ਵਿਆਹਾਂ ਅਤੇ ਤਿਉਹਾਰਾਂ ਮੌਕੇ ਪਹਿਨਣ ਲਈ ਸ਼ਾਹੀ ਅੰਦਾਜ਼ ਦਿੰਦਾ ਹੈ।'
        },
        {
          language: 'en',
          tone: 'premium',
          title: 'Bagh Silk-Thread Hand-Embroidered Phulkari Dupatta',
          tagline: 'Heritage Punjabi textile showcasing exquisite geometric needlework.',
          body: 'Crafted with untwisted mulberry silk floss on handspun khaddar fabric, this Bagh-style Phulkari dupatta is a pinnacle of North Indian textile heritage. Over 12 dedicated days of hand-embroidery, the artisan works entirely from the reverse side using traditional darning stitches to achieve a seamless floral tapestry. Spanning 2.5 meters, its radiant geometric motifs add majestic grandeur to any celebratory attire.'
        },
        {
          language: 'hi',
          tone: 'traditional',
          title: 'पारंपरिक पंजाबी फुलकारी बाग दुपट्टा',
          tagline: 'रेशमी धागों की हाथ की महीन कढ़ाई से सजा अनमोल परिधान।',
          body: 'पंजाब की समृद्ध लोक कला का प्रतिनिधित्व करता यह फुलकारी दुपट्टा शुद्ध रेशमी धागों से तैयार किया गया है। खद्दर के आधार पर की गई यह बारीक कशीदाकारी कई पीढ़ियों की साधना का फल है। तीज-त्योहारों और शादियों में पहनने के लिए यह दुपट्टा अत्यंत गरिमापूर्ण और आकर्षक है।'
        }
      ]
    }
  },
  {
    artisan: {
      phone: '+919876543204',
      firebaseUid: 'seed_artisan_4',
      displayName: 'महादेव कांबळे (Mahadev Kamble)',
      craftType: 'Kolhapuri Leather Craft',
      village: 'Hupari',
      city: 'Kolhapur',
      state: 'Maharashtra',
      yearsExperience: 25,
      bio: 'कोल्हापुरी चपलांचे अस्सल हस्तकलेचे कारागीर. नैसर्गिक भाजलेल्या चामड्यापासून टिकाऊ चपला बनवण्याची परंपरा.',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543204',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'अस्सल हाताने शिवलेली कोल्हापुरी चप्पल',
      tagline: 'नैसर्गिक पद्धतीने कमावलेल्या चामड्याची टिकाऊ आणि पारंपरिक चप्पल.',
      category: 'Footwear & Leather',
      priceInr: 1650.00,
      spokenLanguage: 'mr',
      material: 'Vegetable-tanned buffalo leather, braided leather cords',
      technique: 'Hand-cut, edge-creased, and stitched with cotton and leather cords',
      dimensions: 'Available in Indian Sizes 7, 8, 9, 10',
      colors: 'Natural tan / walnut brown',
      timeToMake: '3 days',
      uses: 'Daily wear, ethnic festivities, festive gifting',
      story: 'कोल्हापूरची ही पारंपरिक चप्पल शतकानुशतके टिकाऊपणा आणि आरोग्यासाठी प्रसिद्ध आहे.',
      care: 'Protect from excess water. Apply light castor oil or coconut oil occasionally.',
      tags: ['kolhapuri', 'leather', 'maharashtra', 'handmade', 'ethnic'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'mr',
          tone: 'simple',
          title: 'पारंपरिक हाताने बनवलेली कोल्हापुरी चप्पल',
          tagline: 'अस्सल कातड्याची, टिकाऊ आणि शरीराला थंडावा देणारी चप्पल.',
          body: 'ही अस्सल कोल्हापुरी चप्पल पूर्णपणे हाताने शिवलेली आहे. यात बाभळीच्या सालीच्या अर्काने नैसर्गिकरीत्या कमावलेले चामडे वापरले आहे, ज्यामुळे पायांना कोणताही त्रास होत नाही. पारंपरिक वणी आणि कलाकुसर यामुळे ही चप्पल धोतर, कुर्ता किंवा जीन्सवरही अतिशय देखणी दिसते. योग्य काळजी घेतल्यास ही चप्पल अनेक वर्षे टिकते.'
        },
        {
          language: 'en',
          tone: 'traditional',
          title: 'Authentic Hand-Stitched Kolhapuri Leather Sandals',
          tagline: 'Vegetable-tanned natural artisanal footwear from Western Maharashtra.',
          body: 'Hand-crafted by master cobblers in Kolhapur, these iconic sandals are made from pure vegetable-tanned leather treated naturally with babool bark extracts. Built without metallic nails, every sole and braided strap is secured with durable thread bindings. Celebrated for their orthopaedic breathability and distinct rustic sound, they mold naturally to the shape of your feet over time.'
        },
        {
          language: 'hi',
          tone: 'traditional',
          title: 'प्रामाणिक हस्तनिर्मित कोल्हापुरी चप्पल',
          tagline: 'प्राकृतिक चमड़े से बनी सदियों पुरानी टिकाऊ भारतीय पहचान।',
          body: 'महाराष्ट्र की ऐतिहासिक कोल्हापुरी चप्पल अपनी मजबूती और आरामदायक बनावट के लिए पूरे विश्व में जानी जाती है। यह पूरी तरह से हाथों से सिली गई है और इसमें किसी भी प्रकार के हानिकारक केमिकल का उपयोग नहीं किया गया है। पारंपरिक पहनावे के साथ इसका मेल अद्भुत लगता है।'
        }
      ]
    }
  },
  {
    artisan: {
      phone: '+919876543205',
      firebaseUid: 'seed_artisan_5',
      displayName: 'முத்துவேல் ஸ்தபதி (Muthuvel Sthapathi)',
      craftType: 'Bronze Sculpting',
      village: 'Swamimalai',
      city: 'Thanjavur',
      state: 'Tamil Nadu',
      yearsExperience: 28,
      bio: 'சுவாமிமலை பாரம்பரிய வெண்கலச் சிற்பக் கலைஞர். சோழர் கால மெழுகு வார்ப்பு முறையில் சிலைகள் செய்யும் பாரம்பரியம்.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543205',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'சுவாமிமலை பாரம்பரிய வெண்கல நடராஜர் திருவுருவம்',
      tagline: 'சோழர் கால மெழுகு வார்ப்பு முறையில் கையால் வார்க்கப்பட்ட தெய்வீக வெண்கலச் சிலை.',
      category: 'Metalcraft',
      priceInr: 5400.00,
      spokenLanguage: 'ta',
      material: 'Panchaloha bronze alloy (Copper, Zinc, Lead, Silver, Gold trace)',
      technique: 'Lost-wax casting (Madhuchehishtavidhana) and hand-chiseled detailing',
      dimensions: '10 inches height, 8 inches width, weight 2.8 kg',
      colors: 'Antique bronze patina finish',
      timeToMake: '15 days',
      uses: 'Puja altar, spiritual meditation space, heritage collector artifact',
      story: 'சுவாமிமலையின் பாரம்பரிய ஸ்தபதிகளால் தர்ம சாஸ்திரங்களின் அளவீடுகளின்படி காவேரி களிமண் கொண்டு மெழுகு அச்சில் உருவாக்கப்பட்டது.',
      care: 'Wipe with soft dry cloth. Clean with lemon and tamarind paste periodically for shine.',
      tags: ['swamimalai', 'bronze', 'nataraja', 'tamilnadu', 'sculpture'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'ta',
          tone: 'traditional',
          title: 'பாரம்பரிய சுவாமிமலை வெண்கல நடராஜர் சிலை',
          tagline: 'சோழர் பேரரசின் கலை நுணுக்கத்தை பிரதிபலிக்கும் பஞ்சலோக விக்ரகம்.',
          body: 'சுவாமிமலையின் தலைசிறந்த கைவினைக் கலைஞரால் பழமையான மெழுகு வார்ப்பு முறையில் உருவாக்கப்பட்ட அரிய வெண்கல நடராஜர் சிலை இது. காவேரி நதிக்கரை களிமண்ணில் மெழுகு அச்சு செய்து, உருகிய வெண்கலத்தை ஊற்றி வார்க்கப்பட்ட இந்த சிலை, பின்னர் கை உளியால் மிக நேர்த்தியாக செதுக்கப்பட்டுள்ளது. தாண்டவக் கோலத்தில் காட்சியளிக்கும் நடராஜரின் ஒவ்வொரு அணிகலனும் துல்லியமாக வடிவமைக்கப்பட்டுள்ளது. இது உங்கள் இல்லத்திற்கு தெய்வீக அருளையும் அமைதியையும் சேர்க்கும்.'
        },
        {
          language: 'en',
          tone: 'premium',
          title: 'Swamimalai Handcrafted Lost-Wax Bronze Nataraja Icon',
          tagline: 'Heirloom sacred bronze casting adhering to ancient Chola sculptural canons.',
          body: 'Hand-sculpted in the temple town of Swamimalai, Tamil Nadu, this Nataraja bronze sculpture is crafted using the ancient 10th-century lost-wax casting technique (cire-perdue). Every curve of the cosmic dance is initially modeled by hand in beeswax before molten sacred bronze alloy is poured into a Cauvery-clay mold. Once cast, the artisan meticulously chisels the divine features, flaming halo, and flowing locks over two weeks of devotional labor. Weighing 2.8 kilograms and standing 10 inches tall, it is a timeless heirloom.'
        },
        {
          language: 'hi',
          tone: 'premium',
          title: 'स्वामीमलाई हस्तनिर्मित कांस्य नटराज मूर्ति',
          tagline: 'चोल कालीन मोम-ढलाई पद्धति से निर्मित अलौकिक धातु शिल्प।',
          body: 'तमिलनाडु के स्वामीमलाई की विश्वविख्यात कांस्य शिल्प परंपरा से निर्मित यह नटराज प्रतिमा अत्यंत दुर्लभ और पवित्र है। कावेरी नदी की चिकनी मिट्टी के सांचे में ढालकर इसे छेनी और हथौड़ी से तराशा गया है। इसका वजन 2.8 किलोग्राम और ऊंचाई 10 इंच है। पूजा स्थल और कला प्रेमियों के लिए यह अनमोल धरोहर है।'
        }
      ]
    }
  },
  {
    artisan: {
      phone: '+919876543206',
      firebaseUid: 'seed_artisan_6',
      displayName: 'जयदेव पाल (Jaidev Paul)',
      craftType: 'Sholapith Craft',
      village: 'Kumartuli',
      city: 'Kolkata',
      state: 'West Bengal',
      yearsExperience: 15,
      bio: 'ডাকের সাজ এবং শোলার নিখুঁত প্রতিমা ও ঘর সাজানোর শিল্পকর্ম নির্মাতা।',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543206',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'হাতে খোদাই করা শোলার ময়ূরপঙ্খী নৌকা',
      tagline: 'জলাভূমির ভেষজ শোলা উদ্ভিদের মজ্জা থেকে তৈরি অপরূপ দুধসাদা শিল্পকর্ম।',
      category: 'Woodwork & Fibre',
      priceInr: 950.00,
      spokenLanguage: 'hi',
      material: 'Organic Sholapith (Indian cork / Aeschynomene aspera core)',
      technique: 'Fine knife-blade filigree slicing and miniature assembly',
      dimensions: '14 inches length, 8 inches height',
      colors: 'Pristine natural ivory white with subtle gold foil accents',
      timeToMake: '5 days',
      uses: 'Tabletop showpiece, wedding gifting, festive puja decor',
      story: 'বাংলার জলাভূমিতে জন্মানো শোলা গাছের কাণ্ড থেকে ছাল ছাড়িয়ে ধবধবে সাদা মজ্জা দিয়ে এই প্রাচীন শিল্প তৈরি করা হয়।',
      care: 'Keep in dry glass enclosure; keep away from water and direct moisture.',
      tags: ['sholapith', 'bengal', 'handcraft', 'ecofriendly', 'decor'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'hi',
          tone: 'traditional',
          title: 'पश्चिम बंगाल का पारंपरिक शोलापीठ मयूर नाव शिल्प',
          tagline: 'प्राकृतिक पौधे की दूधिया सफेद मज्जा से बारीक नक्काशीदार कलाकृति।',
          body: 'यह अनोखा हस्तशिल्प पश्चिम बंगाल के दलदली क्षेत्रों में पाए जाने वाले शोला पौधे के अंदरूनी गूदे से बनाया गया है। कारीगर ने तेज धार वाले चाकू से शोले की पतली परतों को तराशकर इस मयूरपंखी नाव को रूप दिया है। इसका प्राकृतिक हाथीदांत जैसा सफेद रंग बिना किसी कृत्रिम रंग के खिलता है। यह अत्यंत हल्का, पर्यावरण-अनुकूल और पारंपरिक उत्सवों की शोभा बढ़ाने वाला शोपीस है।'
        },
        {
          language: 'en',
          tone: 'traditional',
          title: 'Hand-Carved Bengal Sholapith Mayurpankhi Boat',
          tagline: 'Intricate botanical plant-core filigree art from the wetlands of Bengal.',
          body: 'Crafted entirely from the spongy, milk-white reed pith of the indigenous water plant Aeschynomene aspera, this traditional Mayurpankhi (peacock boat) exemplifies West Bengal’s delicate Sholapith heritage. Master carvers slice paper-thin veneers and delicately shape floral feathers using a specialized razor-sharp blade without any machinery. Incredibly lightweight and eco-conscious, its pristine ivory finish lends serene artisanal grace to consoles, display cabinets, and festive settings.'
        }
      ]
    }
  },
  {
    artisan: {
      phone: '+919876543207',
      firebaseUid: 'seed_artisan_7',
      displayName: 'सविता बेन (Savita Ben Vankar)',
      craftType: 'Kutch Rogan Art & Weaving',
      village: 'Nirona',
      city: 'Bhuj',
      state: 'Gujarat',
      yearsExperience: 19,
      bio: 'કચ્છના નિરોના ગામના રોગન કલા અને કાપડ ભરતકામના નિષ્ણાત કારીગર.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543207',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'કચ્છની પરંપરાગત હાથવણાટ કચ્છી શાલ',
      tagline: 'શુદ્ધ દેશી ઊન પર હાથેથી ગૂંથેલા અરીસા અને દોરાનું ભાતીગળ કામ.',
      category: 'Textiles',
      priceInr: 2200.00,
      spokenLanguage: 'hi',
      material: 'Indigenous Desi Wool and mirror work accents',
      technique: 'Extra-weft pit loom weaving with hand-embroidered mirror stitches',
      dimensions: '80 x 36 inches',
      colors: 'Charcoal black base with vibrant madder red, ochre, and mirror highlights',
      timeToMake: '7 days',
      uses: 'Winter wrap, ethnic stole, collector textile',
      story: 'કચ્છના રબારી અને વણકર સમુદાય દ્વારા પેઢીઓથી ચાલતી વણાટ કલા, જેમાં રણની સુંદરતા વણાયેલી છે.',
      care: 'Dry clean only; store in breathable cotton bag.',
      tags: ['kutch', 'gujarat', 'woolshawl', 'mirrorwork', 'handloom'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'hi',
          tone: 'traditional',
          title: 'कच्छ की पारंपरिक हस्तनिर्मित ऊनी शॉल',
          tagline: 'देसी ऊन के ताने-बाने पर कच्छी नक्काशी और शीशे का बेमिसाल काम।',
          body: 'गुजरात के कच्छ क्षेत्र के हुनरमंद बुनकरों द्वारा तैयार यह शॉल शुद्ध देसी ऊन से पारंपरिक गड्ढा-करघे (पिट लूम) पर बुनी गई है। इसके किनारों पर स्थानीय जनजातीय रूपांकनों और असली शीशों की हाथ से की गई कढ़ाई इसे अद्भुत आकर्षण प्रदान करती है। यह सर्दियों में सुकूनदेह गर्माहट देती है और किसी भी पारंपरिक परिधान के साथ शाही अंदाज जोड़ती है।'
        },
        {
          language: 'en',
          tone: 'traditional',
          title: 'Handloom Kutch Woolen Stole with Mirror Embroidery',
          tagline: 'Artisanal pit-loom woven pure wool wrap from the heart of Gujarat.',
          body: 'Woven on traditional pit-looms by indigenous Vankar weavers in Kutch, this stole captures the vibrant soul of the Great Rann. Woven from hardy indigenous wool and decorated with intricate extra-weft geometric motifs, the borders are accentuated with hand-embroidered mirrors that catch the ambient light. Warm, durable, and steeped in nomadic textile lore, it measures 80 by 36 inches.'
        }
      ]
    }
  },
  {
    artisan: {
      phone: '+919876543208',
      firebaseUid: 'seed_artisan_8',
      displayName: 'मोहम्मद बशीर (Bashir Ahmad Wani)',
      craftType: 'Walnut Wood Carving',
      village: 'Rainawari',
      city: 'Srinagar',
      state: 'Jammu & Kashmir',
      yearsExperience: 32,
      bio: 'विगत 3 दशक से कश्मीरी अखरोट की लकड़ी पर महीन जाली और चिनाल पत्तियों की नक्काशी के उस्ताद कारीगर।',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      whatsappNumber: '+919876543208',
      whatsappVerified: true,
      whatsappPublicConsent: true
    },
    article: {
      title: 'कश्मीरी अखरोट की लकड़ी का नक्काशीदार आभूषण बॉक्स',
      tagline: 'सूखी अखरोट की लकड़ी पर चिनार के पत्तों की जालीदार हस्तकला।',
      category: 'Woodwork & Fibre',
      priceInr: 1850.00,
      spokenLanguage: 'hi',
      material: 'Seasoned Kashmiri Walnut Wood (Doong)',
      technique: 'Deep relief carving (Jali work) and natural agate stone polishing',
      dimensions: '8 x 5 x 3.5 inches',
      colors: 'Natural dark walnut grain with semi-matte wax finish',
      timeToMake: '6 days',
      uses: 'Jewellery organizer, keepsake box, premium gift',
      story: 'कश्मीर में केवल स्वाभाविक रूप से गिरे हुए पुराने अखरोट के पेड़ों की जड़ और तने की लकड़ी का उपयोग किया जाता है।',
      care: 'Wipe with soft cotton cloth. Apply beeswax once a year for luster.',
      tags: ['kashmir', 'walnutwood', 'carving', 'jewellerybox', 'heritage'],
      images: [
        {
          originalUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
          enhancedUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
          enhancementMethod: 'sharp+gemini',
          isHero: true
        }
      ],
      descriptions: [
        {
          language: 'hi',
          tone: 'premium',
          title: 'कश्मीरी अखरोट की लकड़ी का नक्काशीदार संदूकचा',
          tagline: 'श्रीनगर के उस्ताद कारीगरों द्वारा गढ़ी गई चिनार पत्तियों की नक्काशी।',
          body: 'यह खूबसूरत आभूषण बॉक्स कई वर्षों तक सुखाई गई कश्मीरी अखरोट की लकड़ी से बनाया गया है। इसके ढक्कन पर चिनार के पत्तों और बेल-बूटों की 3D नक्काशी हाथ के औजारों से की गई है। इसमें किसी कृत्रिम रंग या वार्निश का प्रयोग नहीं किया गया है, बल्कि अकीक पत्थर से घिसकर लकड़ी की प्राकृतिक चमक को उभारा गया है। आपके अनमोल आभूषणों और यादों को सहेजने के लिए यह संदूक एक बेजोड़ तोहफा है।'
        },
        {
          language: 'en',
          tone: 'premium',
          title: 'Hand-Carved Kashmiri Walnut Wood Keepsake Box',
          tagline: 'Relief-carved heirloom jewellery chest featuring iconic Chinar leaf motifs.',
          body: 'Originating from Srinagar’s historic woodcraft guilds, this jewellery box is carved from naturally seasoned, subterranean walnut wood roots renowned for their dense grain and rich hue. Master carvers employ fine chisels to create deeply layered Chinar foliage and openwork trellis (jali) across the lid and sides. Buffed with natural agate stones rather than synthetic varnish, its tactile luster deepens with age.'
        }
      ]
    }
  }
];

export async function seedDatabase() {
  console.log('🌱 Starting database seeding for Artify...');

  for (const item of sampleData) {
    // 1. Create or update user & profile
    const user = await prisma.user.upsert({
      where: { phone: item.artisan.phone },
      update: {},
      create: {
        phone: item.artisan.phone,
        firebaseUid: item.artisan.firebaseUid,
        uiLanguage: item.article.spokenLanguage,
        role: 'artisan',
        profile: {
          create: {
            displayName: item.artisan.displayName,
            craftType: item.artisan.craftType,
            village: item.artisan.village,
            city: item.artisan.city,
            state: item.artisan.state,
            yearsExperience: item.artisan.yearsExperience,
            bio: item.artisan.bio,
            photoUrl: item.artisan.photoUrl,
            whatsappNumber: item.artisan.whatsappNumber,
            whatsappVerified: item.artisan.whatsappVerified,
            whatsappPublicConsent: item.artisan.whatsappPublicConsent
          }
        }
      },
      include: { profile: true }
    });

    // 2. Create article
    const article = await prisma.article.create({
      data: {
        artisanId: user.id,
        status: 'published',
        publishedAt: new Date(),
        title: item.article.title,
        tagline: item.article.tagline,
        category: item.article.category,
        priceInr: item.article.priceInr,
        spokenLanguage: item.article.spokenLanguage,
        material: item.article.material,
        technique: item.article.technique,
        dimensions: item.article.dimensions,
        colors: item.article.colors,
        timeToMake: item.article.timeToMake,
        uses: item.article.uses,
        story: item.article.story,
        care: item.article.care,
        tags: item.article.tags,
        images: {
          create: item.article.images.map(img => ({
            originalUrl: img.originalUrl,
            enhancedUrl: img.enhancedUrl,
            enhancementMethod: img.enhancementMethod,
            isHero: img.isHero
          }))
        },
        descriptions: {
          create: item.article.descriptions.map(desc => ({
            language: desc.language,
            tone: desc.tone,
            title: desc.title,
            tagline: desc.tagline,
            body: desc.body
          }))
        }
      },
      include: { images: true }
    });

    // Set heroImageId
    if (article.images && article.images.length > 0) {
      await prisma.article.update({
        where: { id: article.id },
        data: { heroImageId: article.images[0].id }
      });
    }

    console.log(`✅ Seeded artisan "${item.artisan.displayName}" with article "${item.article.title}"`);
  }

  console.log('🎉 Seed completed successfully! Storefront has rich initial content.');
}

// Auto-run if executed directly via `node seed.js`
if (process.argv[1]?.includes('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

export default seedDatabase;
