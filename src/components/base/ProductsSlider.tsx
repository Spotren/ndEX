import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

type ProductItem = {
  imageSrc: string
  name: string
  category: string
  price?: string
  url?: string
}

type Props = {
  title: string
  description: string
  products: ProductItem[]
}

function ProductsSlider({ title, description, products }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateControls = useCallback(() => {
    if (!emblaApi) return
    setCanScrollLeft(emblaApi.canScrollPrev())
    setCanScrollRight(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateControls()
    emblaApi.on('select', updateControls)
    emblaApi.on('reInit', updateControls)

    return () => {
      emblaApi.off('select', updateControls)
      emblaApi.off('reInit', updateControls)
    }
  }, [emblaApi, updateControls])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <div className="relative">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            aria-label="Previous products"
            onClick={scrollPrev}
            className={[
              'inline-flex size-11 items-center justify-center rounded-full border border-border/60 text-foreground transition hover:bg-accent',
              canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-30',
            ].join(' ')}
          >
            <span className="icon-[mdi--arrow-left] size-5"></span>
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={scrollNext}
            className={[
              'inline-flex size-11 items-center justify-center rounded-full border border-border/60 text-foreground transition hover:bg-accent',
              canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-30',
            ].join(' ')}
          >
            <span className="icon-[mdi--arrow-right] size-5"></span>
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="-mx-6 overflow-hidden px-6 sm:-mx-8 sm:px-8">
        <div className="flex gap-6">
          {products.map((product) => {
            const Tag = product.url ? 'a' : 'article'

            return (
              <Tag
                key={`${product.name}-${product.category}`}
                href={product.url}
                className="block min-w-0 shrink-0 basis-[80%] overflow-hidden rounded-3xl border border-border/50 bg-card/40 transition hover:bg-accent/20 sm:basis-[calc((100%-1.5rem)/2.5)]"
              >
                <div className="border-b border-border/40 bg-muted/20">
                  <img src={product.imageSrc} alt={product.name} className="aspect-[3/2] w-full object-cover" draggable="false" />
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{product.name}</h3>
                  {product.price && <p className="font-mono text-base text-muted-foreground/90 whitespace-nowrap">{product.price}</p>}
                </div>
              </Tag>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProductsSlider
