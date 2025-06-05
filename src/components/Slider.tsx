"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { Card, CardContent, CardFooter, CardTitle } from "@/shared/ui/kit/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/kit/carousel";
import Link from "next/link";
import { Work } from "@prisma/client";

interface Props {
  list: Work[];
}

export const Slider = ({ list }: Props) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div className="flex flex-col w-full overflow-hidden" tabIndex={0}>
      <Carousel
        plugins={[plugin.current]}
        className="px-4 w-full mx-auto md:max-w-2/3"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {list.map((item, index) => (
            <CarouselItem key={index}>
              <div className="text-center">
                <Card>
                  <CardTitle>{item.title}</CardTitle>
                  <CardContent className="flex items-center justify-center select-none pointer-events-none">
                    <Image
                      src={item.imagePath}
                      alt={item.title}
                      width={600}
                      height={400}
                   sizes="100"
                      priority
                      className="w-fit h-auto max-h-[400px]"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col justify-center items-center gap-4">
                    <Link
                      href={item.linkPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500/85 px-2 py-1 rounded-md"
                    >
                      View project
                    </Link>
                    <div className="text-muted-foreground py-2 text-center text-sm ">
                      Slide {index + 1} of {list.length}
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
