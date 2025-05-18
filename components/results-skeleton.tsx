import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4 md:w-1/2 bg-secondary" />
        <Skeleton className="h-6 w-1/2 md:w-1/3 bg-secondary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24 bg-secondary" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1 bg-secondary" />
              <Skeleton className="h-4 w-20 bg-secondary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-secondary" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full bg-secondary" />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-secondary" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full bg-secondary" />
          <Skeleton className="h-4 w-full bg-secondary" />
          <Skeleton className="h-4 w-3/4 bg-secondary" />
          <Skeleton className="h-4 w-5/6 bg-secondary" />
          <Skeleton className="h-4 w-full bg-secondary" />
        </CardContent>
      </Card>
    </div>
  )
}
