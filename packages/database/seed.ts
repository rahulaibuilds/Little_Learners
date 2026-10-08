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

  console.log('✅ Database seed completed!')
  console.log(`Created: 2 parents, 3 children, 4 levels, 6 domains, ${competencies.count} competencies, ${learningOutcomes.count} learning outcomes, 7 activities`)
}

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
  })