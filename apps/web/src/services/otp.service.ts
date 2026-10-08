"use client"

import { useState, useEffect, useCallback } from "react"

/**
 * Mock OTP Service for development
 * In production, replace with ProductionOtpService
 */

export interface OtpService {
  sendOTP(contact: string): Promise<{ success: boolean; requestId: string }>
  verifyOTP(contact: string, code: string): Promise<{ success: boolean; user?: any; error?: string }>
  resendOTP(contact: string, requestId: string): Promise<{ success: boolean; newRequestId: string; countdown: number }>
  getStatus(contact: string): Promise<{ expiry?: Date; remainingAttempts: number; isVerified: boolean }>
}

/**
 * Mock OTP Service - development only
 * Generates a 4-digit OTP and simulates sending/verification
 */
export class MockOtpService implements OtpService {
  private otpStore: Map<string, { code: string; expires: Date; attempts: number; maxAttempts: number; requestId: string }> = new Map()

  async sendOTP(contact: string): Promise<{ success: boolean; requestId: string }> {
    // Clear any existing OTP for this contact
    this.otpStore.delete(contact)

    const code = Math.floor(1000 + Math.random() * 8999).toString()
    const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    const requestId = `otp_${Date.now()}_${Math.random().toString(36).slice(2)}`

    this.otpStore.set(contact, { code, expires, attempts: 0, maxAttempts: 3, requestId })

    console.log(`[MockOtpService] OTP sent to ${contact}: ${code}, expires in 5 minutes, requestId: ${requestId}`)
    
    return { success: true, requestId }
  }

  async verifyOTP(contact: string, code: string): Promise<{ success: boolean; user?: any; error?: string }> {
    const store = this.otpStore.get(contact)

    if (!store) {
      return { success: false, error: "No OTP request found. Please request a new OTP." }
    }

    store.attempts += 1

    if (code === store.code) {
      // OTP verified - return mock user
      const mockUser = {
        id: `user_${Date.now()}`,
        contact,
        verified: true,
      }

      // Clear the OTP after successful verification
      this.otpStore.delete(contact)

      console.log `[MockOtpService] OTP verified for ${contact}`)
      return { success: true, user: mockUser }
    }

    if (store.attempts >= store.maxAttempts) {
      this.otpStore.delete(contact)
      return { success: false, error: "Maximum OTP attempts exceeded. Please request a new OTP." }
    }

    const remaining = store.maxAttempts - store.attempts
    return { success: false, error: `Incorrect OTP. ${remaining} attempt(s) remaining.` }
  }

  async resendOTP(contact: string, requestId: string): Promise<{ success: boolean; newRequestId: string; countdown: number }> {
    // If the current requestId matches, start a new countdown
    // Otherwise, just send a new OTP
    await this.sendOTP(contact)

    const countdown = 120 // 2 minutes in seconds
    
    console.log `[MockOtpService] OTP resent to ${contact}, countdown: ${countdown}s`)
    
    return { success: true, newRequestId: requestId, countdown }
  }

  async getStatus(contact: string): Promise<{ expiry?: Date; remainingAttempts: number; isVerified: boolean }> {
    const store = this.otpStore.get(contact)

    if (!store) {
      return { remainingAttempts: 3, isVerified: false }
    }

    const now = new Date()
    const remainingAttempts = store.maxAttempts - store.attempts
    const isVerified = store.attempts > 0 && store.code === "" // simplified

    return { 
      expiry: store.expires, 
      remainingAttempts, 
      isVerified 
    }
  }
}

/**
 * Production OTP Service interface (stub for implementation)
 */
export class ProductionOtpService implements OtpService {
  async sendOTP(contact: string): Promise<{ success: boolean; requestId: string }> {
    // TODO: Implement with actual OTP provider (Twilio, AWS SNS, etc.)
    console.warn("[ProductionOtpService] Not implemented - using mock")
    const mock = new MockOtpService()
    return mock.sendOTP(contact)
  }

  async verifyOTP(contact: string, code: string): Promise<{ success: boolean; user?: any; error?: string }> {
    console.warn("[ProductionOtpService] Not implemented - using mock")
    const mock = new MockOtpService()
    return mock.verifyOTP(contact, code)
  }

  async resendOTP(contact: string, requestId: string): Promise<{ success: boolean; newRequestId: string; countdown: number }> {
    console.warn("[ProductionOtpService] Not implemented - using mock")
    const mock = new MockOtpService()
    return mock.resendOTP(contact, requestId)
  }

  async getStatus(contact: string): Promise<{ expiry?: Date; remainingAttempts: number; isVerified: boolean }> {
    console.warn("[ProductionOtpService] Not implemented - using mock")
    const mock = new MockOtpService()
    return mock.getStatus(contact)
  }
}

/**
 * OTP Service factory - returns mock in dev, production in prod
 */
export function createOtpService(): OtpService {
  const provider = process.env.OTP_PROVIDER || "mock"

  if (provider === "production" || provider === "twilio" || provider == "aws") {
    return new ProductionOtpService()
  }

  return new MockOtpService()
}

export const otpService = createOtpService()

export type { OtpService }