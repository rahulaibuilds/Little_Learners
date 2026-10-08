import { TodayButton } from "../../components/ui/today-button"
import { TodayOutline } from "lucide-react"
import { Heart } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Grid, Progress, ProgressRing } from "radix-velocity"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import React from "react"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-width-2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 2L2 7h20l-8 5-8-5z"
              />
            </svg>
            <span className="text-xl font-bold text-primary">LearnNest India</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-width-2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7h20l-8 5-8-5z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-sm text-muted-foreground">Registered Parents</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-card p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7h20l-8 5-8-5z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">3,892</div>
                <div className="text-sm text-muted-foreground">Child Profiles</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-card p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7h20l-8 5-8-5z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">42</div>
                <div className="text-sm text-muted-foreground">Activities Published</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            className="py-3 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create New Activity
          </Button>
          <Button
            variant="outline"
            className="py-3 px-4 rounded-md border-2 border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Manage Curriculum
          </Button>
          <Button
            className="py-3 px-4 rounded-md bg-success text-white font-medium hover:bg-success/90 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            View Stories
          </Button>
          <Button
            variant="outline"
            className="py-3 px-4 rounded-md border-2 border-success text-success font-medium hover:bg-success/10 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            View Reports
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Activity card 1 */}
            <div className="p-4 rounded-md bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">New Activity Created</h4>
                  <p className="text-sm text-muted-foreground">Alphabet Matching added</p>
                </div>
              </div>
            </div>

            {/* Activity card 2 */}
            <div className="p-4 rounded-md bg-success/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-success/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Story Published</h4>
                  <p className="text-sm text-muted-foreground">The Little Elephant's Trunk</p>
                </div>
              </div>
            </div>

            {/* Activity card 3 */}
            <div className="p-4 rounded-md bg-warning/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Rhyme Added</h4>
                  <p className="text-sm text-muted-foreground">Numbers Song</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}