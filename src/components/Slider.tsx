'use client';

import { useRef, useState, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

import { Card, CardContent, CardFooter, CardTitle } from '@/shared/ui/kit/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/kit/carousel';
import Link from 'next/link';
import { Work } from '@prisma/client';
import { WorkSliderSkeleton } from './works/WorkSliderSkeleton';

interface Props {
  list: Work[];
}

export const Slider = ({ list }: Props) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [displayList, setDisplayList] = useState<Work[]>([]);

  useEffect(() => {
    const initialValidList = list.filter(item => item.imageUrl);

    if (initialValidList.length === 0) {
        setImagesLoaded(true);
        setDisplayList([]);
        return;
    }

    const loadImage = (url: string) => {
      return new Promise((resolve, reject) => {
        if (!url) {
          return reject('Image URL is null or empty');
        }
        const img = new window.Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(`Failed to load image at: ${url}`);
      });
    };

    Promise.allSettled(initialValidList.map((item) => loadImage(item.imageUrl)))
      .then((results) => {
        const successfullyLoadedWorks = initialValidList.filter((_item, index) => {
            return results[index].status === 'fulfilled';
        });

        const failedLoads = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
        if (failedLoads.length > 0) {
            console.warn('Some images failed to preload:', failedLoads.map(f => f.reason));
        }

        setDisplayList(successfullyLoadedWorks);
        setImagesLoaded(true);
      });
  }, [list]);

  if (!imagesLoaded) {
    return <WorkSliderSkeleton />;
  }

  return (
    <div className="flex flex-col w-full overflow-hidden" tabIndex={0}>
      <Carousel
        plugins={[plugin.current]}
        className="px-4 w-full mx-auto md:max-w-2/3"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {displayList.map((item, index) => (
            <CarouselItem key={index}>
              <div className="text-center">
                <Card>
                  <CardTitle>{item.title}</CardTitle>
                  <CardContent className="flex items-center justify-center select-none pointer-events-none">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-auto" // ИЗМЕНЕНО: Исправлены стили для сохранения пропорций
                      priority={index === 0} // ИЗМЕНЕНО: Добавлен приоритет для первого изображения (LCP)
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col justify-center items-center gap-4">
                    <Link
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500/85 px-2 py-1 rounded-md"
                    >
                      View project
                    </Link>
                    <div className="text-muted-foreground py-2 text-center text-sm ">
                      Slide {index + 1} of {displayList.length}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
