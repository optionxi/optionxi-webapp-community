import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingTraderProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />
              <CardContent className="-mt-16 relative">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
                {/* <Tabs defaultValue="stats" className="mt-6">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="specialties">Specialties</TabsTrigger>
                  </TabsList>
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </Tabs> */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Section */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>

            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <Skeleton className="h-16 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

