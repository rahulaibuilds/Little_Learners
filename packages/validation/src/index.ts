// LearnNest India - Validation Schemas
// Zod-based validation for forms and API requests

import { z } from "zod"

/**
 * Parent signup validation
 */
export const parentSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  mobileNumber: z.string().min(10, "Valid mobile number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  city: z.string().optional(),
  state: z.string().optional(),
  preferredLanguage: z.enum(["EN", "HI", "HINGLISH"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ParentSignupValues = z.infer<typeof parentSignupSchema>

/**
 * Child onboarding validation
 */
export const childOnboardingSchema = z.object({
  childName: z.string().min(2, "Child name must be at least 2 characters"),
  childNickname: z.string().optional(),
  dateOfBirth: z.date(),
  level: z.enum(["PLAYGROUP", "NURSERY", "LKG", "UKG"]),
  avatar: z.string(),
  preferredLanguage: z.enum(["EN", "HI", "HINGLISH"]),
  pin: z.string().length(4, "PIN must be 4 digits"),
  confirmPin: z.string().length(4, "Confirm PIN must be 4 digits"),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
})

export type ChildOnboardingValues = z.infer<typeof childOnboardingSchema>

/**
 * Login validation
 */
export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
})

export type LoginValues = z.infer<typeof loginSchema>

/**
 * OTP verification validation
 */
export const otpVerifySchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits"),
})

export type OtpVerifyValues = z.infer<typeof otpVerifySchema>

/**
 * Activity creation validation
 */
export const activityCreationSchema = z.object({
  code: z.string().min(1, "Activity code required"),
  title: z.string().min(2, "Title required"),
  titleHi: z.string().optional(),
  titleHinglish: z.string().optional(),
  description: z.string().optional(),
  descriptionHi: z.string().optional(),
  descriptionHinglish: z.string().optional(),
  levelId: z.string().min(1, "Level required"),
  domainId: z.string().optional(),
  competencyId: z.string().optional(),
  learningOutcomeId: z.string().optional(),
  activityType: z.enum([
    "TAP_CORRECT", "DRAG_DROP", "MATCHING", "SORTING",
    "MEMORY", "COUNTING", "TRACING", "PATTERN_COMPLETION",
    "SEQUENCING", "PICTURE_SELECTION", "LISTENING",
    "PRONUNCIATION", "STORY_INTERACTION", "MAZE",
    "PUZZLE", "SPOT_DIFFERENCE", "SHAPE_MATCHING",
    "COLOURING", "EMOTION_RECOGNITION", "DAILY_ROUTINE_ORDERING"
  ]),
  difficulty: z.enum(["VERY_EASY", "EASY", "MEDIUM", "HARD", "VERY_HARD"]).default("EASY"),
  language: z.enum(["EN", "HI", "HINGLISH"]).default("EN"),
  estimatedDurationSec: z.number().int().positive(),
  instructions: z.string().optional(),
  instructionsHi: z.string().optional(),
  instructionsHinglish: z.string().optional(),
  media: z.object({}).optional(),
  configuration: z.object({}).optional(),
  hints: z.array(z.string()).default([]),
  reward: z.object({
    type: z.enum(["STAR", "BADGE", "STICKER", "MILESTONE"]),
    points: z.number().int().default(10),
  }).optional(),
  prerequisites: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
})

export type ActivityCreationValues = z.infer<typeof activityCreationSchema>

/**
 * Login credentials validation
 */
export const credentialsSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
})

export type CredentialsValues = z.infer<typeof credentialsSchema>

/**
 * PIN validation
 */
export const pinSchema = z.object({
  pin: z.string().length(4, "PIN must be 4 digits"),
})

export type PinValues = z.infer<typeof pinSchema>

/**
 * Story creation validation
 */
export const storyCreationSchema = z.object({
  code: z.string().min(1, "Story code required"),
  title: z.string().min(2, "Title required"),
  titleHi: z.string().optional(),
  titleHinglish: z.string().optional(),
  description: z.string().optional(),
  descriptionHi: z.string().optional(),
  descriptionHinglish: z.string().optional(),
  levelId: z.string().min(1, "Level required"),
  language: z.enum(["EN", "HI", "HINGLISH"]).default("EN"),
  characters: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  audioUrl: z.string().optional(),
  durationSec: z.number().int().positive(),
  learningObjective: z.string().optional(),
  learningObjectiveHi: z.string().optional(),
  learningObjectiveHinglish: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
})

export type StoryCreationValues = z.infer<typeof storyCreationSchema>

/**
 * Rhyme creation validation
 */
export const rhymeCreationSchema = z.object({
  code: z.string().min(1, "Rhyme code required"),
  title: z.string().min(2, "Title required"),
  titleHi: z.string().optional(),
  titleHinglish: z.string().optional(),
  levelId: z.string().min(1, "Level required"),
  language: z.enum(["EN", "HI", "HINGLISH"]).default("EN"),
  lyrics: z.string(),
  lyricsHi: z.string().optional(),
  lyricsHinglish: z.string().optional(),
  audioUrl: z.string().optional(),
  illustration: z.string().optional(),
  theme: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
})

export type RhymeCreationValues = z.infer<typeof rhymeCreationSchema>

/**
 * Parent consent validation
 */
export const parentConsentSchema = z.object({
  consentType: z.enum(["TERMS_OF_SERVICE", "PRIVACY_POLICY", "CHILD_DATA_PROCESSING", "MARKETING_COMMUNICATIONS", "ANALYTICS"]),
  consentVersion: z.string().min(1, "Consent version required"),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

export type ParentConsentValues = z.infer<typeof parentConsentSchema>

/**
 * Weekly report filters validation
 */
export const weeklyReportFiltersSchema = z.object({
  parentId: z.string().optional(),
  childId: z.string().optional(),
  weekStart: z.string().optional(),
})

export type WeeklyReportFilters = z.infer<typeof weeklyReportFiltersSchema>