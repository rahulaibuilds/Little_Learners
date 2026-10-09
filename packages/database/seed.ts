// LearnNest India - Database Seed
// Sample data for development and testing
// This seed creates original educational content aligned with NEP 2020 and NCF-FS

import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting LearnNest India database seed...')

  // 1. Create Base Users & Parents
  console.log('Creating base users and parents...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@learnnest.in',
      passwordHash: await hashPassword('admin123'),
      role: 'ADMIN',
      isActive: true,
    },
  })

  const parent1 = await prisma.parent.create({
    data: {
      user: {
        create: {
          email: 'parent1@example.com',
          passwordHash: await hashPassword('parent123'),
          role: 'PARENT',
          isActive: true,
        },
      },
      fullName: 'Priya Sharma',
      preferredName: 'Priya',
      city: 'Bengaluru',
      state: 'Karnataka',
      preferredLanguage: 'EN',
      onboardingCompleted: true,
      onboardingStep: 7,
    },
  })

  const parent2 = await prisma.parent.create({
    data: {
      user: {
        create: {
          email: 'parent2@example.com',
          passwordHash: await hashPassword('parent123'),
          role: 'PARENT',
          isActive: true,
        },
      },
      fullName: 'Rohit Patel',
      preferredName: 'Rohit',
      city: 'Mumbai',
      state: 'Maharashtra',
      preferredLanguage: 'HI',
      onboardingCompleted: true,
      onboardingStep: 7,
    },
  })

  // 2. Create Child Profiles
  console.log('Creating child profiles...')
  
  const childAarav = await prisma.childProfile.create({
    data: {
      parent: parent1,
      name: 'Aarav',
      nickname: 'Aaru',
      dateOfBirth: new Date('2021-02-15'),  // Age ~4, LKG
      level: 'LKG',
      avatarId: 'animal_elephant',
      preferredLanguage: 'EN',
      pinHash: await hashPIN('1234'),
      pinEnabled: true,
      isActive: true,
      settings: {
        reduceMotion: false,
        autoAdvanceActivities: true,
        language: 'en',
      },
    },
  })

  const childKiara = await prisma.childProfile.create({
    data: {
      parent: parent1,
      name: 'Kiara',
      nickname: 'Ki',
      dateOfBirth: new Date('2020-11-08'),  // Age ~5, UKG
      level: 'UKG',
      avatarId: 'animal_tiger',
      preferredLanguage: 'HI',
      pinHash: await hashPIN('5678'),
      pinEnabled: true,
      isActive: true,
      settings: {
        reduceMotion: false,
        autoAdvanceActivities: true,
        language: 'hi',
      },
    },
  })

  const childVihaan = await prisma.childProfile.create({
    data: {
      parent: parent2,
      name: 'Vihaan',
      nickname: 'Vihan',
      dateOfBirth: new Date('2022-06-22'),  // Age ~3, Nursery
      level: 'NURSERY',
      avatarId: 'animal_monkey',
      preferredLanguage: 'EN',
      pinHash: await hashPIN('9999'),
      pinEnabled: true,
      isActive: true,
      settings: {
        reduceMotion: true,
        autoAdvanceActivities: false,
        language: 'en',
      },
    },
  })

  // 3. Create Levels
  console.log('Creating levels...')
  
  const levels = await prisma.level.createMany({
    data: [
      {
        code: 'PLAYGROUP',
        name: 'Playgroup',
        nameHi: 'प्लेग्रुप',
        nameHinglish: 'Playgroup',
        description: 'Sensory exploration and basic communication for ages 2-3',
        descriptionHi: '2-3 वर्ष की उम्र के लिए संवेदी अन्वेषण और बुनियादी संचार',
        descriptionHinglish: '2-3 saal ki umar ke liye sansvedi anveshan aur bunyadi sanchar',
        ageMin: 2,
        ageMax: 3,
        order: 1,
        isActive: true,
      },
      {
        code: 'NURSERY',
        name: 'Nursery',
        nameHi: 'नर्सरी',
        nameHinglish: 'Nursery',
        description: 'Language exposure, numeracy, and creative expression for ages 3-4',
        descriptionHi: '3-4 वर्ष की उम्र के लिए भाषा परिचय, संख्यात्मकता और रचनात्मक अभिव्यक्ति',
        descriptionHinglish: '3-4 saal ki umar ke liye bhasha parichay, sankhyatav and rationaitmak abhyay',
        ageMin: 3,
        ageMax: 4,
        order: 2,
        isActive: true,
      },
      {
        code: 'LKG',
        name: 'Lower Kindergarten',
        nameHi: 'एलकेजी',
        nameHinglish: 'LKG',
        description: 'Foundational literacy and numeracy for ages 4-5',
        descriptionHi: '4-5 वर्ष की उम्र के लिए बुनियादी साक्षरता और संख्यात्मकता',
        descriptionHinglish: '4-5 saal ki umar ke liye bunyadi saksarata and sankhyatav',
        ageMin: 4,
        ageMax: 5,
        order: 3,
        isActive: true,
      },
      {
        code: 'UKG',
        name: 'Upper Kindergarten',
        nameHi: 'यूकेजी',
        nameHinglish: 'UKG',
        description: 'Reading readiness, advanced numeracy, and environmental awareness for ages 5-6',
        descriptionHi: '5-6 वर्ष की उम्र के लिए पढ़ने की तैयारी, उन्नत संख्यात्मकता और पर्यावरण जागरूकता',
        descriptionHinglish: '5-6 saal ki umar ke liye padhne ki taiyari, unnat sankhyatav and parivaran jagarukta',
        ageMin: 5,
        ageMax: 6,
        order: 4,
        isActive: true,
      },
    ],
  })

  // 4. Create Domains
  console.log('Creating domains...')
  
  const domains = await prisma.domain.createMany({
    data: [
      {
        code: 'LANGUAGE_LITERACY',
        name: 'Language & Literacy',
        nameHi: 'भाषा और साक्षरता',
        nameHinglish: 'Bhasha aur Saksharta',
        description: 'Alphabet recognition, phonics, vocabulary, and reading readiness',
        descriptionHi: 'अक्षर पहचान, फॉनिक्स, शब्दावली, और पढ़ने की तैयारी',
        descriptionHinglish: 'akshar pehchan, phonix, shabdavali, aur padhne ki taiyari',
        icon: 'text-indicator',
        color: '#4A90E2',
        order: 1,
        isActive: true,
      },
      {
        code: 'MATHEMATICAL_THINKING',
        name: 'Mathematical Thinking',
        nameHi: 'गणितीय सोच',
        nameHinglish: 'Ganitian Sanket',
        description: 'Number recognition, counting, patterns, and spatial reasoning',
        descriptionHi: 'अंक पहचान, गिनती, पैटर्न, और अंतरिक्ष बोध',
        descriptionHinglish: 'ank pehchan, ginti, pattern, aur antarिक्ष bodh',
        icon: 'calculator',
        color: '#7ED321',
        order: 2,
        isActive: true,
      },
      {
        code: 'ENVIRONMENTAL_AWARENESS',
        name: 'Environmental Awareness',
        nameHi: 'पर्यावरण जागरूकता',
        nameHinglish: 'Parivaran Jagruta',
        description: 'Nature, plants, animals, weather, and community',
        descriptionHi: 'प्रकृति, पौधे, जानवर, मौसम, और समुदाय',
        descriptionHinglish: 'prakriti, paude, janvar, mausam, aur samuday',
        icon: 'leaf',
        color: '#FFB400',
        order: 3,
        isActive: true,
      },
      {
        code: 'CREATIVITY_EXPRESSION',
        name: 'Creativity & Expression',
        nameHi: 'रचनात्मकता और अभिव्यक्ति',
        nameHinglish: 'Rachnatmaka Aur Abhivyakti',
        description: 'Drawing, coloring, music, and imaginative play',
        descriptionHi: 'रंग भरना, संगीत, और कल्पनाशील खेल',
        descriptionHinglish: 'rang bharna, sangeet, aur kalpanashil khel',
        icon: 'palette',
        color: '#FF6B6B',
        order: 4,
        isActive: true,
      },
      {
        code: 'SOCIAL_EMOTIONAL',
        name: 'Social & Emotional Development',
        nameHi: 'सामाजिक और भावनात्मक विकास',
        nameHinglish: 'Samajik Aur Bhavnatmaka Vikas',
        description: 'Self-awareness, empathy, communication, and social skills',
        descriptionHi: 'स्व-जागरूकता, सहानुभूति, संचार, और सामाजिक कौशल',
        descriptionHinglish: 'sw-jagrutka, sahanubhu, sanchar, aur samajik kaushal',
        icon: 'heart-hands',
        color: '#4A2C9A',
        order: 5,
        isActive: true,
      },
      {
        code: 'PHYSICAL_MOTOR',
        name: 'Physical & Motor Development',
        nameHi: 'शारीरिक और मोटर विकास',
        nameHinglish: 'Shariarik Aur Motor Vikas',
        description: 'Fine motor, gross motor, and daily routine skills',
        descriptionHi: 'बारीक मोटर, गross मोटर, और दैनिक दिनचर्या कौशल',
        descriptionHinglish: 'baarik motor, gross motor, aur dinacharya kaushal',
        icon: 'fitness',
        color: '#ED4C67',
        order: 6,
        isActive: true,
      },
    ],
  })

  // 5. Create Competencies
  console.log('Creating competencies...')
  
  const languageLiteracyDomain = await prisma.domain.findUnique({
    where: { code: 'LANGUAGE_LITERACY' },
  })
  
  const mathDomain = await prisma.domain.findUnique({
    where: { code: 'MATHEMATICAL_THINKING' },
  })
  
  const envDomain = await prisma.domain.findUnique({
    where: { code: 'ENVIRONMENTAL_AWARENESS' },
  })
  
  const creativityDomain = await prisma.domain.findUnique({
    where: { code: 'CREATIVITY_EXPRESSION' },
  })
  
  const socialDomain = await prisma.domain.findUnique({
    where: { code: 'SOCIAL_EMOTIONAL' },
  })
  
  const physicalDomain = await prisma.domain.findUnique({
    where: { code: 'PHYSICAL_MOTOR' },
  })

  const competencies = await prisma.competency.createMany({
    data: [
      // LKG Competencies
      {
        code: 'ALPHABET_RECOGNITION',
        name: 'Alphabet Recognition',
        nameHi: 'अक्षर पहचान',
        nameHinglish: 'Akshar Pehchan',
        description: 'Recognizes all uppercase and lowercase letters',
        descriptionHi: 'सभी बड़े और छोटे अक्षरों की पहचान करता है',
        descriptionHinglish: 'sabade bada aur chhote akshor pehchan karta hai',
        levelId: 'LKG',
        domainId: languageLiteracyDomain.id,
        order: 1,
        isActive: true,
      },
      {
        code: 'PHONICS_SOUNDS',
        name: 'Letter Sounds',
        nameHi: 'अक्षर स्वर',
        nameHinglish: 'Akshar Swar',
        description: 'Associates correct sound with each letter',
        descriptionHi: 'प्रत्येक अक्षर के साथ सही ध्वनि जोड़ना',
        descriptionHinglish: 'pratyeka akshar ke saath sahi dhwani judna',
        levelId: 'LKG',
        domainId: languageLiteracyDomain.id,
        order: 2,
        isActive: true,
      },
      {
        code: 'NUMBER_RECOGNITION',
        name: 'Number Recognition',
        nameHi: 'अंक पहचान',
        nameHinglish: 'Ank Pehchan',
        description: 'Recognizes numbers 1–20',
        descriptionHi: '1–20 के अंकों की पहचान करता है',
        descriptionHinglish: '1-20 ke ank pehchan karta hai',
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 1,
        isActive: true,
      },
      {
        code: 'COUNTING_1_20',
        name: 'Counting 1–20',
        nameHi: '1–20 तक गिनती',
        nameHinglish: '1-20 tak Ginti',
        description: 'Counts reliably from 1 to 20',
        descriptionHi: '1 से 20 तक विश्वसनीय रूप से गिनता है',
        descriptionHinglish: '1 se 20 tak vishvasniya roop se ginta hai',
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 2,
        isActive: true,
      },
      {
        code: 'SHAPE_IDENTIFICATION',
        name: 'Shape Identification',
        nameHi: 'आकार पहचान',
        nameHinglish: 'Aakar Pehchan',
        description: 'Identifies 2D shapes: circle, square, triangle, rectangle',
        descriptionHi: '2D आकार: गोला, वर्ग, त्रिभुज, आयत की पहचान करता है',
        descriptionHinglish: '2D aakar: gol, varg, tribhuj, ayat pehchan karta hai',
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 3,
        isActive: true,
      },
      {
        code: 'COLOR_RECOGNITION',
        name: 'Color Recognition',
        nameHi: 'रंग पहचान',
        nameHinglish: 'Rang Pehchan',
        description: 'Names and identifies 10 basic colors',
        descriptionHi: '10 बुनियादी रंगों का नाम और पहचान करता है',
        descriptionHinglish: '10 buniyadi rangon ka naam aur pehchan karta hai',
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 4,
        isActive: true,
      },
      {
        code: 'PATTERN_COMPLETION',
        name: 'Pattern Completion',
        nameHi: 'पैटर्न पूर्ण करना',
        nameHinglish: 'Pattern Poorn Karna',
        description: 'Completes simple AB and ABC patterns',
        descriptionHi: 'सरल AB और ABC पैटर्न पूरे करता है',
        descriptionHinglish: 'saral AB aur ABC pattern poora karta hai',
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 5,
        isActive: true,
      },
      {
        code: 'SELF_IDENTIFICATION',
        name: 'Self Identification',
        nameHi: 'स्वयं की पहचान',
        nameHinglish: 'Swami Pehchan',
        description: 'Identifies own name, age, and basic personal information',
        descriptionHi: 'अपना नाम, उम्र और बुनियादी व्यक्तिगत जानकारी की पहचान करता है',
        descriptionHinglish: 'apna naam, umr aur bunyadi vyaktigat jankari pehchan karta hai',
        levelId: 'NURSERY',
        domainId: socialDomain.id,
        order: 1,
        isActive: true,
      },
      {
        code: 'EMPATHY_BASIC',
        name: 'Basic Empathy',
        nameHi: 'बुनियादी सहानुभूति',
        nameHinglish: 'Buniyadi Sahanubhu',
        description: 'Recognizes emotions in others through facial expressions',
        descriptionHi: 'द्वारा चेहरे के भावों में दूसरों के भावों को पहचानता है',
        descriptionHinglish: 'dwara chehre ke bhavon mein doosron ke bhavon ko pehchan karta hai',
        levelId: 'NURSERY',
        domainId: socialDomain.id,
        order: 2,
        isActive: true,
      },
      {
        code: 'DAILY_ROUTINE_FOLLOW',
        name: 'Daily Routine Following',
        nameHi: 'दैनिक दिनचर्या का पालन',
        nameHinglish: 'Dinacharya Ka Palan',
        description: 'Follows simple daily routines like hand-washing, teeth-brushing',
        descriptionHi: 'हाथ धोना, दांत साफ करना जैसी सरल दैनिक दिनचर्या का पालन करता है',
        descriptionHinglish: 'haath dhona, daant saaf karna jaise simple dinacharya ka palan karta hai',
        levelId: 'NURSERY',
        domainId: physicalDomain.id,
        order: 1,
        isActive: true,
      },
      {
        code: 'GROSS_MOTOR_BASIC',
        name: 'Gross Motor Basic',
        nameHi: 'बेसिक ग्रॉस मोटर',
        nameHinglish: 'Basic Gross Motor',
        description: 'Performs basic movements: jumping, hopping, balancing',
        descriptionHi: 'कूदना, हॉपिंग, संतुलन बनाना जैसी बुनियादी गतिविधियां करता है',
        descriptionHinglish: 'kudna, hopping, santulan banana jaise basic gatividiyan karta hai',
        levelId: 'NURSERY',
        domainId: physicalDomain.id,
        order: 2,
        isActive: true,
      },
    ],
  })

  // 6. Create Learning Outcomes
  console.log('Creating learning outcomes...')
  
  const alphabetRecognition = await prisma.competency.findUnique({
    where: { code: 'ALPHABET_RECOGNITION' },
  })
  
  const numberRecognition = await prisma.competency.findUnique({
    where: { code: 'NUMBER_RECOGNITION' },
  })
  
  const shapeIdentification = await prisma.competency.findUnique({
    where: { code: 'SHAPE_IDENTIFICATION' },
  })

  const learningOutcomes = await prisma.learningOutcome.createMany({
    data: [
      {
        code: 'RECOGNIZES_ALL_LETTERS',
        name: 'Recognizes all uppercase and lowercase letters',
        nameHi: 'सभी बड़े और छोटे अक्षरों की पहचान करता है',
        nameHinglish: 'Sabade bada aur chhote akshor pehchan karta hai',
        competencyId: alphabetRecognition.id,
        levelId: 'LKG',
        domainId: languageLiteracyDomain.id,
        order: 1,
        isActive: true,
      },
      {
        code: 'ASSOCIATES_LETTER_SOUNDS',
        name: 'Associates correct sound with each letter',
        nameHi: 'प्रत्येक अक्षर के साथ सही ध्वनि जोड़ना',
        nameHinglish: 'Pratyeka akshar ke saath sahi dhwani judna',
        competencyId: alphabetRecognition.id,
        levelId: 'LKG',
        domainId: languageLiteracyDomain.id,
        order: 2,
        isActive: true,
      },
      {
        code: 'RECOGNIZES_NUMBERS_1_TO_20',
        name: 'Recognizes numbers 1–20',
        nameHi: '1–20 के अंकों की पहचान करता है',
        nameHinglish: '1-20 ke ank pehchan karta hai',
        competencyId: numberRecognition.id,
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 1,
        isActive: true,
      },
      {
        code: 'COUNTS_RELIABLY_1_TO_20',
        name: 'Counts reliably from 1 to 20',
        nameHi: '1 से 20 तक विश्वसनीय रूप से गिनता है',
        nameHinglish: '1 se 20 tak vishvasniya roop se ginta hai',
        competencyId: numberRecognition.id,
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 2,
        isActive: true,
      },
      {
        code: 'IDENTIFIES_2D_SHAPES',
        name: 'Identifies 2D shapes: circle, square, triangle, rectangle',
        nameHi: '2D आकार: गोला, वर्ग, त्रिभुज, आयत की पहचान करता है',
        nameHinglish: '2D aakar: gol, varg, tribhuj, ayat pehchan karta hai',
        competencyId: shapeIdentification.id,
        levelId: 'LKG',
        domainId: mathDomain.id,
        order: 3,
        isActive: true,
      },
    ],
  })

  // 7. Create Sample Activities
  console.log('Creating sample activities...')
  
  // Activity 1: Alphabet Matching (LKG, Language & Literacy)
  await prisma.activity.create({
    data: {
      code: 'ALPHA_MATCH_001',
      title: 'Alphabet Matching',
      titleHi: 'अक्षर मिलान',
      titleHinglish: 'Akshar Milan',
      description: 'Match uppercase letters with their lowercase partners',
      descriptionHi: 'बड़े अक्षरों को उनके छोटे साथियों से मिलाना',
      descriptionHinglish: 'Bade akshor ko unke chhote saathiyo se milana',
      levelId: 'LKG',
      domainId: languageLiteracyDomain.id,
      competencyId: alphabetRecognition.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_ALL_LETTERS')!.id,
      activityType: 'MATCHING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Tap the lowercase letter that matches the uppercase letter shown',
      instructionsHi: 'उपर दिखाया गया बड़ा अक्षर मिलाने के लिए छोटा अक्षर टैप करें',
      instructionsHinglish: 'Upar dikhaya gaya bada akshar milane ke liye chhota akshar tap karein',
      media: {
        images: ['/illustrations/alphabet-matching-bg.jpg'],
        audio: '/sounds/alphabet-intro.mp3',
      },
      configuration: {
        pairs: 10,
        showHints: true,
        timerEnabled: false,
      },
      hints: [
        'Look at the first letter of the picture',
        'Letter A says "Aaah"',
      ],
      reward: {
        type: 'STAR',
        points: 10,
        animation: 'star-pop',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 2: Number Safari (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'NUM_SAFARI_001',
      title: 'Number Safari',
      titleHi: 'संख्या सफारी',
      titleHinglish: 'Sankhya Safari',
      description: 'Find and tap numbers 1–10 in the jungle scene',
      descriptionHi: 'जंगल दृश्य में 1–10 के अंक खोजें और टैप करें',
      descriptionHinglish: 'Jungal drikhya mein 1-10 ke ank khojen aur tap karein',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: numberRecognition.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_NUMBERS_1_TO_20')!.id,
      activityType: 'TAP_CORRECT',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Find and tap the number 5',
      instructionsHi: 'संख्या 5 खोजें और टैप करें',
      instructionsHinglish: 'Sankhya 5 khojen aur tap karein',
      media: {
        images: ['/illustrations/jungle-scene.jpg'],
        audio: '/sounds/number-intro.mp3',
      },
      configuration: {
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        randomize: true,
      },
      hints: [
        'Look for the number with that many stars',
        '5 stars! Can you find it?',
      ],
      reward: {
        type: 'STAR',
        points: 15,
        animation: 'safari-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 3: Shape Builder (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'SHAPE_BUILDER_001',
      title: 'Shape Builder',
      titleHi: 'आकार निर्माण',
      titleHinglish: 'Aakar Nirmaan',
      description: 'Drag and drop shapes to complete the picture',
      descriptionHi: 'आकार खींचकर और छोड़कर चित्र पूरा करें',
      descriptionHinglish: 'Aakar khinch kar aur chor kar chitrak poora karein',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: shapeIdentification.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'IDENTIFIES_2D_SHAPES')!.id,
      activityType: 'DRAG_DROP',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 150,
      instructions: 'Drag the circle to the correct position',
      instructionsHi: 'वृत को सही स्थान पर खींचें',
      instructionsHinglish: 'Vrit ko sahi sthan par khenchin',
      media: {
        images: ['/illustrations/shapes-bg.jpg'],
        audio: '/sounds/shape-intro.mp3',
      },
      configuration: {
        shapes: ['circle', 'square', 'triangle', 'rectangle'],
        snapToGrid: true,
      },
      hints: [
        'A circle is round like a ball',
        'Find the circle in the picture',
      ],
      reward: {
        type: 'STICKER',
        points: 12,
        animation: 'sticker-win',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 4: Color Quest (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'COLOR_QUEST_001',
      title: 'Color Quest',
      titleHi: 'रंग खोज',
      titleHinglish: 'Rang Khoj',
      description: 'Tap objects of the specified color',
      descriptionHi: 'उन वस्तुओं को टैप करें जो निर्दिष्ट रंग की हों',
      descriptionHinglish: 'Un vishayon ko tap karein jo nirdeshit rang ki hon',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'COLOR_RECOGNITION' },
      })!,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_ALL_LETTERS')!.id, // reuse or create
      activityType: 'PICTURE_SELECTION',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Tap all the red objects',
      instructionsHi: 'सभी लाल वस्तुओं को टैप करें',
      instructionsHinglish: 'Saree laal vishayon ko tap karein',
      media: {
        images: ['/illustrations/color-quest.jpg'],
        audio: '/sounds/color-intro.mp3',
      },
      configuration: {
        targetColor: 'red',
        objectCount: 8,
      },
      hints: [
        'Red like a tomato!',
        'Find the red apple',
      ],
      reward: {
        type: 'STAR',
        points: 10,
        animation: 'rainbow-pop',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 5: Pattern Fun (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'PATTERN_FUN_001',
      title: 'Pattern Fun',
      titleHi: 'मज़ेदार पैटर्न',
      titleHinglish: 'Mazeeda Pattern',
      description: 'Complete the AB pattern by dragging the correct shape',
      descriptionHi: 'सही आकृति खींचकर AB पैटर्न पूरा करें',
      descriptionHinglish: 'Sahi aakriti khinch kar AB pattern poorna karein',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'PATTERN_COMPLETION' },
      })!,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_ALL_LETTERS')!.id,
      activityType: 'PATTERN_COMPLETION',
      difficulty: 'MEDIUM',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Drag the shape that comes next in the pattern',
      instructionsHi: 'पैटर्न में अगला क्या आएगा उसे खींचें',
      instructionsHinglish: 'Pattern mein aage kaise aaenge ushe khenchin',
      media: {
        images: ['/illustrations/pattern-fun.jpg'],
        audio: '/sounds/pattern-intro.mp3',
      },
      configuration: {
        patternType: 'AB',
        patternCount: 5,
      },
      hints: [
        'Look at the first two shapes',
        'What comes after the square?',
      ],
      reward: {
        type: 'STICKER',
        points: 15,
        animation: 'pattern-win',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 6: Selfie Mirror (Nursery, Social & Emotional)
  await prisma.activity.create({
    data: {
      code: 'SELFIE_MIRROR_001',
      title: 'Selfie Mirror',
      titleHi: 'स्वयं दर्पण',
      titleHinglish: 'Selfie Mirror',
      description: 'Identify facial features and emotions',
      descriptionHi: 'चेहरे के अंगों और भावों की पहचान करें',
      descriptionHinglish: 'Chehre ke angon aur bhavon pehchan karein',
      levelId: 'NURSERY',
      domainId: socialDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'EMPATHY_BASIC' },
      })!,
      learningOutcomeId: await prisma.learningOutcome.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      activityType: 'PICTURE_SELECTION',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Tap the happy face',
      instructionsHi: 'खुश चेहरा टैप करें',
      instructionsHinglish: 'Khush chehra tap karein',
      media: {
        images: ['/illustrations/selfie-mirror.jpg'],
        audio: '/sounds/emotion-intro.mp3',
      },
      configuration: {
        emotionOptions: ['happy', 'sad', 'angry', 'surprised'],
        showFaces: true,
      },
      hints: [
        'Look at the smiling face',
        'Happy faces have curved mouths',
      ],
      reward: {
        type: 'STICKER',
        points: 8,
        animation: 'mirror-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 7: Wash Hands Routine (Nursery, Physical Motor)
  await prisma.activity.create({
    data: {
      code: 'WASH_HANDS_001',
      title: 'Wash Hands Routine',
      titleHi: 'हाथ धोना',
      titleHinglish: 'Haath Dhona',
      description: 'Learn the steps of hand washing through sequencing',
      descriptionHi: 'हाथ धोने के कदमों को सीखें sequencing के माध्यम से',
      descriptionHinglish: 'Haath dhone ke kadamon ko seekhne sequencing ke madhyam se',
      levelId: 'NURSERY',
      domainId: physicalDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'DAILY_ROUTINE_FOLLOW' },
      })!,
      learningOutcomeId: await prisma.learningOutcome.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      activityType: 'SEQUENCING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Put the hand-washing steps in the correct order',
      instructionsHi: 'हाथ धोने के कदम सही क्रम में रखें',
      instructionsHinglish: 'Haath dhone ke kadam sahi kram mein rakhein',
      media: {
        images: ['/illustrations/wash-hands.jpg'],
        audio: '/sounds/routine-intro.mp3',
      },
      configuration: {
        steps: ['Turn on water', 'Apply soap', 'Scrub hands', 'Rinse', 'Turn off water'],
        dragEnabled: true,
      },
      hints: [
        'First we turn on the water',
        'Then we apply soap',
      ],
      reward: {
        type: 'STICKER',
        points: 10,
        animation: 'wash-hands-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activities 8-15: More LKG activities
  // Activity 8: Tracing Letters (LKG, Language & Literacy)
  await prisma.activity.create({
    data: {
      code: 'TRACE_LETTERS_001',
      title: 'Letter Tracing',
      titleHi: 'अक्षर लेखन',
      titleHinglish: 'Akshar Lekhan',
      description: 'Trace uppercase and lowercase letters with your finger',
      descriptionHi: 'अपने उंगली से बड़े और छोटे अक्षरों का अनुसरण करें',
      descriptionHinglish: 'Apne ungli se baade aur chhote aksharon ka anusaran karein',
      levelId: 'LKG',
      domainId: languageLiteracyDomain.id,
      competencyId: alphabetRecognition.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'ASSOCIATES_LETTER_SOUNDS')!.id,
      activityType: 'TRACING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Trace the letter A starting from the top',
      instructionsHi: 'सबसे ऊपर से अक्षर A का अनुसरण करें',
      instructionsHinglish: 'Sab se upar se akshar A ka anusaran karein',
      media: {
        images: ['/illustrations/letter-tracing.jpg'],
        audio: '/sounds/letter-intro.mp3',
      },
      configuration: {
        letters: ['A', 'B', 'C', 'D', 'E'],
        showGuide: true,
      },
      hints: [
        'Start at the top',
        'Follow the dotted line',
      ],
      reward: {
        type: 'STAR',
        points: 10,
        animation: 'star-pop',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 9: Counting Game (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'COUNTING_GAME_001',
      title: 'Counting Game',
      titleHi: 'गिनती खेल',
      titleHinglish: 'Ginti Khel',
      description: 'Count the objects and select the correct number',
      descriptionHi: 'वस्तुओं की गिनती करें और सही संख्या चुनें',
      descriptionHinglish: 'Vastuon ki gintein aur sahi sankhya choose karein',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: numberRecognition.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'COUNTS_RELIABLY_1_TO_20')!.id,
      activityType: 'TAP_CORRECT',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Tap the number that tells how many stars',
      instructionsHi: 'वह संख्या टैप करें जो कितने तारे दर्शाती है',
      instructionsHinglish: 'Us sankhya tap karein jo kitne taare daikhati hai',
      media: {
        images: ['/illustrations/counting-game.jpg'],
        audio: '/sounds/number-intro.mp3',
      },
      configuration: {
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        objectCount: 5,
      },
      hints: [
        'Count each star one by one',
        'The correct number is at the bottom',
      ],
      reward: {
        type: 'STAR',
        points: 15,
        animation: 'safari-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 10: Story Sequencing (LKG, Language & Literacy)
  await prisma.activity.create({
    data: {
      code: 'STORY_SEQ_001',
      title: 'Story Sequencing',
      titleHi: 'कहानी क्रमबद्ध करना',
      titleHinglish: 'Kahani Krambhed Karna',
      description: 'Arrange the story events in the correct order',
      descriptionHi: 'कहानी के घटनाओं को सही क्रम में व्यवस्थित करें',
      descriptionHinglish: 'Kahani ke ghaton ko sahi kram mein vyavasthapit karein',
      levelId: 'LKG',
      domainId: languageLiteracyDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_ALL_LETTERS')!.id,
      activityType: 'SEQUENCING',
      difficulty: 'MEDIUM',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Drag the pictures to put the story in order',
      instructionsHi: 'कहानी को क्रम में लगाने के लिए तस्वीरों को खींचें',
      instructionsHinglish: 'Kahani ko kram lagne ke liye tasveeron ko khein',
      media: {
        images: ['/illustrations/story-seq.jpg'],
        audio: '/sounds/story-intro.mp3',
      },
      configuration: {
        steps: 4,
        showHints: true,
      },
      hints: [
        'Look at the first picture',
        'What happened next?',
      ],
      reward: {
        type: 'STICKER',
        points: 20,
        animation: 'pattern-win',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 11: Matching Shadows (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'MATCH_SHADOW_001',
      title: 'Match the Shadow',
      titleHi: 'छाया से मिलान',
      titleHinglish: 'Chaya Se Milan',
      description: 'Match the object with its correct shadow',
      descriptionHi: 'वस्तु को उसके सही छाया से मिलाएं',
      descriptionHinglish: 'Vastu ko usi chhaya se milayein',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: shapeIdentification.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'IDENTIFIES_2D_SHAPES')!.id,
      activityType: 'MATCHING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Drag the circle to its shadow',
      instructionsHi: 'वृत्त को इसकी छाया में खींचें',
      instructionsHinglish: 'Vrit ko usi chhaya main khein',
      media: {
        images: ['/illustrations/shadow-match.jpg'],
        audio: '/sounds/shape-intro.mp3',
      },
      configuration: {
        shapes: ['circle', 'square', 'triangle'],
      },
      hints: [
        'Look at the outline',
        'Shapes have the same size',
      ],
      reward: {
        type: 'STICKER',
        points: 12,
        animation: 'sticker-win',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 12: Color Mixing (LKG, Creativity & Expression)
  await prisma.activity.create({
    data: {
      code: 'COLOR_MIX_001',
      title: 'Color Mixing',
      titleHi: 'रंग मिश्रण',
      titleHinglish: 'Rang Mishran',
      description: 'Mix two colors to create a new color',
      descriptionHi: 'दो रंगों को मिलाकर एक नया रंग बनाएं',
      descriptionHinglish: 'Do rangon ko milakar naya rang banayein',
      levelId: 'LKG',
      domainId: creativityDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'COLOR_RECOGNITION' },
      })!,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_ALL_LETTERS')!.id,
      activityType: 'PICTURE_SELECTION',
      difficulty: 'MEDIUM',
      language: 'EN',
      estimatedDurationSec: 150,
      instructions: 'Tap the color needed to make green',
      instructionsHi: 'हर बनाने के लिए रंग टैप करें',
      instructionsHinglish: 'Har banane ke liye rang tap karein',
      media: {
        images: ['/illustrations/color-mix.jpg'],
        audio: '/sounds/color-intro.mp3',
      },
      configuration: {
        primaryColor: 'red',
        secondaryColor: 'blue',
        targetColor: 'green',
      },
      hints: [
        'Red and blue make green',
        'Mix them carefully',
      ],
      reward: {
        type: 'STICKER',
        points: 15,
        animation: 'rainbow-pop',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 13: Pattern Completion (Nursery, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'PATT_COMPL_NURS_001',
      title: 'Pattern Fun',
      titleHi: 'मज़ेदार पैटर्न',
      titleHinglish: 'Mazeeda Pattern',
      description: 'Complete the AB pattern by dragging the correct shape',
      descriptionHi: 'सही आकृति खींचकर AB पैटर्न पूरा करें',
      descriptionHinglish: 'Sahi aakriti khinch kar AB pattern poorna karein',
      levelId: 'NURSERY',
      domainId: mathDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'PATTERN_COMPLETION' },
      })!,
      learningOutcomeId: await prisma.learningOutcome.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      activityType: 'PATTERN_COMPLETION',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Drag the shape that comes next in the pattern',
      instructionsHi: 'पैटर्न में अगला क्या आएगा उसे खींचें',
      instructionsHinglish: 'Pattern mein aage kaise aaenge ushe khenchin',
      media: {
        images: ['/illustrations/pattern-fun.jpg'],
        audio: '/sounds/pattern-intro.mp3',
      },
      configuration: {
        patternType: 'AB',
        patternCount: 5,
      },
      hints: [
        'Look at the first two shapes',
        'What comes after the square?',
      ],
      reward: {
        type: 'STICKER',
        points: 15,
        animation: 'pattern-win',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 14: Wash Hands Routine (Nursery, Physical Motor)
  await prisma.activity.create({
    data: {
      code: 'WASH_HANDS_001',
      title: 'Wash Hands Routine',
      titleHi: 'हाथ धोना',
      titleHinglish: 'Haath Dhona',
      description: 'Learn the steps of hand washing through sequencing',
      descriptionHi: 'हाथ धोने के कदमों को सीखें sequencing के माध्यम से',
      descriptionHinglish: 'Haath dhone ke kadamon ko seekhne sequencing ke madhyam se',
      levelId: 'NURSERY',
      domainId: physicalDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'DAILY_ROUTINE_FOLLOW' },
      })!,
      learningOutcomeId: await prisma.learningOutcome.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      activityType: 'SEQUENCING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Put the hand-washing steps in the correct order',
      instructionsHi: 'हाथ धोने के कदम सही क्रम में रखें',
      instructionsHinglish: 'Haath dhone ke kadam sahi kram mein rakhein',
      media: {
        images: ['/illustrations/wash-hands.jpg'],
        audio: '/sounds/routine-intro.mp3',
      },
      configuration: {
        steps: ['Turn on water', 'Apply soap', 'Scrub hands', 'Rinse', 'Turn off water'],
        dragEnabled: true,
      },
      hints: [
        'First we turn on the water',
        'Then we apply soap',
      ],
      reward: {
        type: 'STICKER',
        points: 10,
        animation: 'wash-hands-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 15: Emotion Matching (Nursery, Social & Emotional)
  await prisma.activity.create({
    data: {
      code: 'EMOTION_MATCH_001',
      title: 'Emotion Matching',
      titleHi: 'भाव मिलान',
      titleHinglish: 'Bhav Milan',
      description: 'Match the facial expression with the correct emotion',
      descriptionHi: 'चेहरे के भाव को सही भाव से मिलाएं',
      descriptionHinglish: 'Chehre ke bhav ko sahi bhav se milayein',
      levelId: 'NURSERY',
      domainId: socialDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'EMPATHY_BASIC' },
      })!,
      learningOutcomeId: await prisma.learningOutcome.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      activityType: 'PICTURE_SELECTION',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Tap the happy face',
      instructionsHi: 'खुश चेहरा टैप करें',
      instructionsHinglish: 'Khush chehra tap karein',
      media: {
        images: ['/illustrations/emotion-match.jpg'],
        audio: '/sounds/emotion-intro.mp3',
      },
      configuration: {
        emotionOptions: ['happy', 'sad', 'angry', 'surprised'],
        showFaces: true,
      },
      hints: [
        'Look at the smiling mouth',
        'Happy faces have curved mouths',
      ],
      reward: {
        type: 'STICKER',
        points: 8,
        animation: 'mirror-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 16: Food Sorting (LKG, Environmental Awareness)
  await prisma.activity.create({
    data: {
      code: 'FOOD_SORT_001',
      title: 'Food Sorting',
      titleHi: 'खाद्य पदार्थों का वर्गीकरण',
      titleHinglish: 'Food Sorting',
      description: 'Sort foods into healthy and sometimes-healthy categories',
      descriptionHi: 'खाद्य पदार्थों को स्वस्थ और कभी-कभी स्वस्थ श्रेणियों में वर्गीकृत करें',
      descriptionHinglish: 'Khaay padarthon ko swasth aur kabhi-kabhi swasth shreniyon main vargikaran karein',
      levelId: 'LKG',
      domainId: envDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_ALL_LETTERS')!.id,
      activityType: 'SORTING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 150,
      instructions: 'Drag food items to the correct category',
      instructionsHi: 'खाद्य पदार्थों को सही श्रेणी में खींचें',
      instructionsHinglish: 'Khaay padarthon ko sahi shreniyon main khein',
      media: {
        images: ['/illustrations/food-sort.jpg'],
        audio: '/sounds/food-intro.mp3',
      },
      configuration: {
        categories: ['healthy', 'sometimes-healthy'],
        foodItems: ['apple', 'candy', 'carrot', 'cake', 'banana'],
      },
      hints: [
        'An apple is healthy',
        'Candy is a sometimes-food',
      ],
      reward: {
        type: 'STAR',
        points: 10,
        animation: 'rainbow-pop',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 17: Number Tracing (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'TRACE_NUMBERS_001',
      title: 'Number Tracing',
      titleHi: 'अंक लेखन',
      titleHinglish: 'Ank Lekhan',
      description: 'Trace numbers 1-10 with your finger',
      descriptionHi: 'अपनी उंगली से अंक 1-10 का अनुसरण करें',
      descriptionHinglish: 'Apni ungli se ank 1-10 ka anusaran karein',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: numberRecognition.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'COUNTS_RELIABLY_1_TO_20')!.id,
      activityType: 'TRACING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Trace the number 5 starting from the top',
      instructionsHi: 'सबसे ऊपर से अंक 5 का अनुसरण करें',
      instructionsHinglish: 'Sab se upar se ank 5 ka anusaran karein',
      media: {
        images: ['/illustrations/number-tracing.jpg'],
        audio: '/sounds/number-intro.mp3',
      },
      configuration: {
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        showGuide: true,
      },
      hints: [
        'Start at the top',
        'Follow the dotted line',
      ],
      reward: {
        type: 'STAR',
        points: 10,
        animation: 'star-pop',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 18: Shape Tracing (LKG, Mathematical Thinking)
  await prisma.activity.create({
    data: {
      code: 'TRACE_SHAPES_001',
      title: 'Shape Tracing',
      titleHi: 'आकार लेखन',
      titleHinglish: 'Aakar Lekhan',
      description: 'Trace 2D shapes: circle, square, triangle, rectangle',
      descriptionHi: '2D आकार: गोला, वर्ग, त्रिभुज, आयत का अनुसरण करें',
      descriptionHinglish: '2D aakar: gol, varg, tribhuj, ayat ka anusaran karein',
      levelId: 'LKG',
      domainId: mathDomain.id,
      competencyId: shapeIdentification.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'IDENTIFIES_2D_SHAPES')!.id,
      activityType: 'TRACING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 120,
      instructions: 'Trace the circle starting from the top',
      instructionsHi: 'सबसे ऊपर से वृत्त का अनुसरण करें',
      instructionsHinglish: 'Sab se upar se vrit ka anusaran karein',
      media: {
        images: ['/illustrations/shape-tracing.jpg'],
        audio: '/sounds/shape-intro.mp3',
      },
      configuration: {
        shapes: ['circle', 'square', 'triangle', 'rectangle'],
        showGuide: true,
      },
      hints: [
        'Start at the top',
        'Follow the dotted line',
      ],
      reward: {
        type: 'STICKER',
        points: 12,
        animation: 'sticker-win',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 19: Animal Sounds (LKG, Language & Literacy)
  await prisma.activity.create({
    data: {
      code: 'ANIMAL_SOUNDS_001',
      title: 'Animal Sounds',
      titleHi: 'जानवर की आवाजें',
      titleHinglish: 'Jaanwar Aawazain',
      description: 'Match the animal with the sound it makes',
      descriptionHi: 'उस जानवर की आवाज से मिलाएं जिसे यह आवाज सुनाता है',
      descriptionHinglish: 'Us jaanwar aawazain se milayein jo ye aawaz sunaata hai',
      levelId: 'LKG',
      domainId: languageLiteracyDomain.id,
      competencyId: alphabetRecognition.id,
      learningOutcomeId: learningOutcomes.find((o) => o.code === 'RECOGNIZES_ALL_LETTERS')!.id,
      activityType: 'PICTURE_SELECTION',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Tap the animal that says "moo"',
      instructionsHi: 'वह पशु टैप करें जो "मू" कहता है',
      instructionsHinglish: 'Us pasu tap karein jo "moo" khta hai',
      media: {
        images: ['/illustrations/animal-sounds.jpg'],
        audio: '/sounds/animal-intro.mp3',
      },
      configuration: {
        animals: ['cow', 'dog', 'cat', 'bird'],
        sounds: ['moo', 'bark', 'meow', 'chirp'],
      },
      hints: [
        'A cow says moo',
        'Listen carefully',
      ],
      reward: {
        type: 'STAR',
        points: 10,
        animation: 'safari-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // Activity 20: Good Habits Sequencing (Nursery, Physical Motor)
  await prisma.activity.create({
    data: {
      code: 'GOOD_HABITS_001',
      title: 'Good Habits',
      titleHi: 'अच्छी आदतें',
      titleHinglish: 'Achhi Adatein',
      description: 'Learn good habits through sequencing',
      descriptionHi: 'अच्छी आदतों को sequencing के माध्यम से सीखें',
      descriptionHinglish: 'Achhi adatein ko sequencing ke madhyam se seekhine',
      levelId: 'NURSERY',
      domainId: physicalDomain.id,
      competencyId: await prisma.competency.findFirst({
        where: { code: 'DAILY_ROUTINE_FOLLOW' },
      })!,
      learningOutcomeId: await prisma.learningOutcome.findFirst({
        where: { code: 'SELF_IDENTIFICATION' },
      })!,
      activityType: 'SEQUENCING',
      difficulty: 'EASY',
      language: 'EN',
      estimatedDurationSec: 180,
      instructions: 'Put the good habit steps in the correct order',
      instructionsHi: 'अच्छी आदत के कदम सही क्रम में रखें',
      instructionsHinglish: 'Achhi adat ke kadam sahi kram mein rakhein',
      media: {
        images: ['/illustrations/good-habits.jpg'],
        audio: '/sounds/routine-intro.mp3',
      },
      configuration: {
        steps: ['Brush teeth', 'Wash hands', 'Eat food', 'Sleep on time'],
        dragEnabled: true,
      },
      hints: [
        'First we brush our teeth',
        'Then we wash hands',
      ],
      reward: {
        type: 'STICKER',
        points: 10,
        animation: 'wash-hands-cheer',
      },
      prerequisites: [],
      status: 'PUBLISHED',
    },
  })

  // 7. Create Sample Stories
  console.log('Creating sample stories...')
  
  const story1 = await prisma.story.create({
    data: {
      code: 'STORY_001',
      title: "The Little Elephant's Trunk",
      titleHi: 'छोटी हाथी की सूंड',
      titleHinglish: 'Choti Haathi Ki Sund',
      description: 'A little elephant learns to use his trunk to help friends',
      descriptionHi: 'एक छोटी हाथी अपने सूंड का उपयोग दोस्तों की मदद करने के लिए सीखता है',
      descriptionHinglish: 'Ek choti haathi apne sund ka upayog doston ki madad karne ke liye seekhta hai',
      levelId: 'NURSERY',
      language: 'EN',
      characters: ['Molu the Elephant', 'Titu the Mouse'],
      coverImage: '/illustrations/story-1.jpg',
      audioUrl: '/sounds/story-1.mp3',
      durationSec: 180,
      learningObjective: 'Understanding how we can help others',
      learningObjectiveHi: 'यह समझना कि हम दूसरों की मदद कैसे कर सकते हैं',
      learningObjectiveHinglish: 'Samjhna ki hum doosron ki madad kaise kar sakte hain',
      status: 'PUBLISHED',
    },
  })

  const story2 = await prisma.story.create({
    data: {
      code: 'STORY_002',
      title: 'The Kind Lion',
      titleHi: 'दयालु सिंह',
      titleHinglish: 'Dayalu Singh',
      description: 'A lion learns that kindness is stronger than strength',
      descriptionHi: 'एक सिंह सीखता है कि kindness शक्ति से बड़ी है',
      descriptionHinglish: 'Ek singh seekhta hai ki kindness shakti se baadi hai',
      levelId: 'LKG',
      language: 'EN',
      characters: ['Leo the Lion', 'Monkey friends'],
      coverImage: '/illustrations/story-2.jpg',
      audioUrl: '/sounds/story-2.mp3',
      durationSec: 240,
      learningObjective: 'Learning the value of kindness',
      learningObjectiveHi: 'दयालु बनने का मूल्य सीखना',
      learningObjectiveHinglish: 'Dayalu banne ka moolya seekhna',
      status: 'PUBLISHED',
    },
  })

  const story3 = await prisma.story.create({
    data: {
      code: 'STORY_003',
      title: "Riya's Rainbow",
      titleHi: 'रीनबो की रिया',
      titleHinglish: 'Riya Ka Rainbow',
      description: 'Riya discovers the colors of the rainbow and their names',
      descriptionHi: 'रीनबो की रंगों की नाम सीखती है',
      descriptionHinglish: 'Riya rangon ki naam seekhati hai',
      levelId: 'PLAYGROUP',
      language: 'EN',
      characters: ['Riya', 'Sunny the Sun'],
      coverImage: '/illustrations/story-3.jpg',
      audioUrl: '/sounds/story-3.mp3',
      durationSec: 120,
      learningObjective: 'Learning color names',
      learningObjectiveHi: 'रंगों के नाम सीखना',
      learningObjectiveHinglish: 'Rangon ke naam seekhna',
      status: 'PUBLISHED',
    },
  })

  console.log('Creating sample rhymes...')
  
  // 8. Create Sample Rhymes
  const rhyme1 = await prisma.rhyme.create({
    data: {
      code: 'RHYME_001',
      title: 'Twinkle Twinkle Little Star',
      titleHi: 'चमचम तारे',
      titleHinglish: 'Chamcham Taare',
      levelId: 'PLAYGROUP',
      language: 'EN',
      lyrics: 'Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.\nTwinkle, twinkle, little star,\nHow I wonder what you are!',
      lyricsHi: 'चमचम तारे,\nमैं तुम्हें क्या हूँ, यह सोचकर चकित हूँ!\nआसमान के ऊपर इतना,\nआकाश में हीरा जैसा!\nचमचम तारे,\nमैं तुम्हें क्या हूँ, यह सोचकर चकित हूँ!',
      lyricsHinglish: 'Chamcham taare,\nMain aapko kya hai, sochkar chakit hoon!\nAasman ke upar itna,\nAakash mein heera jaisa!\nChamcham taare,\nMain aapko kya hai, sochkar chakit hoon!',
      audioUrl: '/sounds/rhyme-1.mp3',
      illustration: '/illustrations/rhyme-1.jpg',
      durationSec: 120,
      theme: 'Night sky',
      status: 'PUBLISHED',
    },
  })

  const rhyme2 = await prisma.rhyme.create({
    data: {
      code: 'RHYME_002',
      title: 'Alo Alo Aankh Mare',
      titleHi: 'अलो अलो आँख मारे',
      titleHinglish: 'Alo Alo Aankh Mare',
      levelId: 'NURSERY',
      language: 'HI',
      lyrics: 'Alo Alo aankh mare,\nBachpan ka mpassage kare,\nKhel khel badal kare,\nMitti ki kali kare.\nAlo Alo aankh mare,\nBachpan ka mpassage kare.',
      lyricsHinglish: 'Alo Alo aankh mare,\nBachpan ka mpassage kare,\nKhel khel badal kare,\nMitti ki kali kare.\nAlo Alo aankh mare,\nBachpan ka mpassage kare.',
      audioUrl: '/sounds/rhyme-2.mp3',
      illustration: '/illustrations/rhyme-2.jpg',
      durationSec: 90,
      theme: 'Childhood games',
      status: 'PUBLISHED',
    },
  })

  const rhyme3 = await prisma.rhyme.create({
    data: {
      code: 'RHYME_003',
      title: 'Numbers Song',
      titleHi: 'गिनती गीत',
      titleHinglish: 'Ginti Geet',
      levelId: 'LKG',
      language: 'EN',
      lyrics: 'One, two, three, four, five,\nOnce I caught a fish alive,\nSix, seven, eight, nine, ten,\nThen I let it go again!\nCatch a tiger by the toe,\nIf he screams let him go!\nOne, two, three, four, five!',
      lyricsHi: 'एक, दो, तीन, चार, पाँच,\nएक जीवित मछली पकड़ी,\नौ, दस,\nफिर मुझे छोड़ दो!\nबाघ की उंगली पकड़ी,\nयदि वह चिल्लाए तो उसे छोड़ दो!\nएक, दो, तीन, चार, पाँच!',
      lyricsHinglish: 'Ek, do, teen, char, panch,\nEk jivita machli pakadi,\nNav, das,\nPhir mujh chhod do!\nBaagh ki ungli pakadi,\nYah us chillaaye to use chhod do!\nEk, do, teen, char, panch!',
      audioUrl: '/sounds/rhyme-3.mp3',
      illustration: '/illustrations/rhyme-3.jpg',
      durationSec: 120,
      theme: 'Counting',
      status: 'PUBLISHED',
    },
  })

  console.log('✅ Database seed completed!')
  console.log(`Created: 2 parents, 3 children, 4 levels, 6 domains, ${competencies.count} competencies, ${learningOutcomes.count} learning outcomes, 20 activities, 3 stories, 3 rhymes`)
  
  // Print story and rhyme counts
  const storyCount = await prisma.story.count({ where: { status: 'PUBLISHED' } })
  const rhymeCount = await prisma.rhyme.count({ where: { status: 'PUBLISHED' } })
  console.log(`Created: ${storyCount} published stories, ${rhymeCount} published rhymes`)

async function hashPassword(password: string): Promise<string> {
  // In production, use Argon2id or bcrypt
  // For seed, we use a simple hash simulation
  return `$2b$12$dummyhash${password.length.toString().padStart(2, '0')}`
}

async function hashPIN(pin: string): Promise<string> {
  return `$2b$12$dummyhash${pin.length.toString().padStart(2, '0')}`
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  });
