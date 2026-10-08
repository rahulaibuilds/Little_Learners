// LearnNest India - Type Definitions
// Shared types used across the application

export type ChildLevel = 
  | "PLAYGROUP"
  | "NURSERY" 
  | "LKG"
  | "UKG"

export type LanguageCode = 
  | "EN" 
  | "HI" 
  | "HINGLISH"

export type ActivityType = 
  | "TAP_CORRECT"
  | "DRAG_DROP"
  | "MATCHING"
  | "SORTING"
  | "MEMORY"
  | "COUNTING"
  | "TRACING"
  | "PATTERN_COMPLETION"
  | "SEQUENCING"
  | "PICTURE_SELECTION"
  | "LISTENING"
  | "PRONUNCIATION"
  | "STORY_INTERACTION"
  | "MAZE"
  | "PUZZLE"
  | "SPOT_DIFFERENCE"
  | "SHAPE_MATCHING"
  | "COLOURING"
  | "EMOTION_RECOGNITION"
  | "DAILY_ROUTINE_ORDERING"

export type ActivityStatus = 
  | "DRAFT"
  | "REVIEW"
  | "PUBLISHED"
  | "ARCHIVED"

export type DifficultyLevel = 
  | "VERY_EASY"
  | "EASY"
  | "MEDIUM"
  | "HARD"
  | "VERY_HARD"

export type MasteryLevel = 
  | "NOT_STARTED"
  | "INTRODUCED"
  | "PRACTICING"
  | "DEVELOPING"
  | "CONFIDENT"

export type ConsentType = 
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY"
  | "CHILD_DATA_PROCESSING"
  | "MARKETING_COMMUNICATIONS"
  | "ANALYTICS"

export type ConsentStatus = 
  | "GRANTED"
  | "WITHDRAWN"
  | "PENDING"
  | "EXPIRED"

export type RewardType = 
  | "STAR"
  | "BADGE"
  | "STICKER"
  | "MILESTONE"

export type SessionType = 
  | "PARENT"
  | "CHILD"
  | "ADMIN"

export interface ParentSignupForm {
  fullName: string
  email: string
  mobileNumber: string
  password: string
  confirmPassword: string
  city?: string
  state?: string
  preferredLanguage: LanguageCode
}

export interface ChildOnboardingForm {
  childName: string
  childNickname?: string
  dateOfBirth: Date
  level: ChildLevel
  avatar: string
  preferredLanguage: LanguageCode
  pin: string
  confirmPin: string
}

export interface ActivityFilters {
  level?: ChildLevel
  domain?: string
  activityType?: ActivityType
  difficulty?: DifficultyLevel
  language?: LanguageCode
  status?: ActivityStatus
}

export interface SkillMastery {
  id: string
  childId: string
  competencyId: string
  level: MasteryLevel
  score: number
  practiceCount: number
  correctCount: number
  totalAttempts: number
  lastPracticedAt?: Date
  masteredAt?: Date
}

export interface ProgressRecord {
  id: string
  childId: string
  domainId: string
  levelId: string
  activitiesCompleted: number
  totalActivities: number
  accuracy: number
  averageScore: number
  totalTimeSpentMs: number
  lastActivityAt?: Date
}

export interface ParentConsent {
  consentType: ConsentType
  consentVersion: string
  status: ConsentStatus
  grantedAt: Date
  withdrawnAt?: Date
  expiresAt?: Date
  metadata?: Record<string, any>
}

export interface LearningPathItem {
  id: string
  activityId: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED"
  startedAt?: Date
  completedAt?: Date
  timeSpentMs: number
  score?: number
}

export interface WeeklyReportSummary {
  weekStartDate: Date
  weekEndDate: Date
  sessionsCount: number
  activitiesCount: number
  totalTimeMs: number
  strengths: string[]
  practiceAreas: string[]
  recommendations: string[]
}