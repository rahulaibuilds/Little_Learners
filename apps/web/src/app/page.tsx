"use client"
import "./globals.css"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">
            LearnNest India
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Interactive foundational learning platform for Indian children
            approximately 2–6 years old.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="stroke-width-2" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7h20l-8 5-8-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">Playgroup (2-3 yrs)</h3>
              <p className="text-sm text-muted-foreground">Sensory exploration and basic communication</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="stroke-width-2" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7h20l-8 5-8-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">Nursery (3-4 yrs)</h3>
              <p className="text-sm text-muted-foreground">Language and numeracy foundation</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="stroke-width-2" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7h20l-8 5-8-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">LKG (4-5 yrs)</h3>
              <p className="text-sm text-muted-foreground">Reading and numeracy readiness</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="stroke-width-2" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7h20l-8 5-8-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium">UKG (5-6 yrs)</h3>
              <p className="text-sm text-muted-foreground">Reading mastery and environmental awareness</p>
            </div>
          </div>
          <div className="mt-8">
            <Button
              onClick={() => window.location.href = "/auth/signup"}
              className="py-2 px-6 rounded-md bg-primary text-white font-medium"
            >
              Get Started →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}