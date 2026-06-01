import { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'

type FaqItem = {
  category: string
  question: string
  answer: string
}

type Props = {
  title: string
  description: string
  faqs: FaqItem[]
}

function FaqSection({ title, description, faqs }: Props) {
  const categories = useMemo(() => {
    return Array.from(new Set(faqs.map((item) => item.category.trim()).filter(Boolean)))
  }, [faqs])
  const groups = useMemo(() => {
    return categories.map((category) => ({
      category,
      items: faqs.filter((item) => item.category.trim() === category),
    }))
  }, [categories, faqs])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
  }, [Fade()])
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateActiveIndex()
    emblaApi.on('select', updateActiveIndex)
    emblaApi.on('reInit', updateActiveIndex)

    return () => {
      emblaApi.off('select', updateActiveIndex)
      emblaApi.off('reInit', updateActiveIndex)
    }
  }, [emblaApi, updateActiveIndex])

  const selectCategory = (index: number) => {
    emblaApi?.scrollTo(index)
  }

  return (
    <div className="grid gap-8 md:grid-cols-[0.4fr_0.6fr] md:items-start">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-col items-start gap-3">
          {groups.map((group, index) => (
            <button
              key={group.category}
              type="button"
              onClick={() => selectCategory(index)}
              className={[
                'group inline-flex items-center gap-3 text-left text-sm font-medium transition',
                activeIndex === index
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <span
                className={[
                  'h-px w-8 transition',
                  activeIndex === index ? 'bg-foreground' : 'bg-border/70 group-hover:bg-foreground',
                ].join(' ')}
              ></span>
              {group.category}
            </button>
          ))}
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden pl-px pr-px">
        <div className="flex">
          {groups.map((group) => (
            <div key={group.category} className="min-w-0 shrink-0 basis-full">
              <div className="grid gap-3">
                {group.items.map((item, index) => (
                  <details key={`${group.category}-${item.question}`} open={index === 0} className="rounded-2xl border border-border/60 bg-card/30 px-5 py-4">
                    <summary className="cursor-pointer list-none pr-8 font-medium text-foreground">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FaqSection
