import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'

type ReviewItem = {
  name: string
  role?: string
  rating: number
  quote: string
}

type ReviewMetric = {
  icon: string
  primaryValue: number | string
  primaryLabel?: string
  secondaryValue?: number | string
  secondaryLabel?: string
}

type Props = {
  title: string
  description: string
  reviews: ReviewItem[]
  metric: ReviewMetric
}

function ReviewsSection({ title, description, reviews, metric }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
  }, [Fade()])

  const showPrevious = () => {
    emblaApi?.scrollPrev()
  }

  const showNext = () => {
    emblaApi?.scrollNext()
  }

  return (
    <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${metric.icon} h-6 w-6 text-muted-foreground`}></span>
          <span className="text-muted-foreground text-sm">
            {metric.primaryValue}
            {metric.primaryLabel ? ` ${metric.primaryLabel}` : ''}
            {metric.secondaryValue !== undefined && (
              <>
                {' '}
                {typeof metric.secondaryValue === 'number' ? Intl.NumberFormat('en-US').format(metric.secondaryValue) : metric.secondaryValue}
                {metric.secondaryLabel ? ` ${metric.secondaryLabel}` : ''}
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous review"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border/60 text-foreground transition hover:bg-accent"
          >
            <span className="icon-[mdi--arrow-left] size-5"></span>
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next review"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border/60 text-foreground transition hover:bg-accent"
          >
            <span className="icon-[mdi--arrow-right] size-5"></span>
          </button>
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden pr-px">
        <div className="flex">
          {reviews.map((review) => (
            <div key={`${review.name}-${review.quote}`} className="min-w-0 shrink-0 basis-full">
              <div className="rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <span key={starIndex} className="icon-[mdi--star] size-5"></span>
                  ))}
                </div>
                <blockquote className="text-lg leading-relaxed text-foreground sm:text-xl">"{review.quote}"</blockquote>
                <div className="mt-6">
                  <p className="font-medium text-foreground">{review.name}</p>
                  {review.role && <p className="text-muted-foreground text-sm">{review.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewsSection
