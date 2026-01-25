
import { Card, CardContent, CardFooter, CardTitle } from "@/shared/ui/kit/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/kit/carousel";

export const WorkSliderSkeleton = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden" tabIndex={0}>
      <Carousel
        className="px-4 w-full mx-auto md:max-w-2/3"
      >
        <CarouselContent>
          <CarouselItem>
            <div className="text-center">
              <Card>
                <CardTitle className="h-8 w-1/2 mx-auto bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></CardTitle>
                <CardContent className="flex items-center justify-center select-none pointer-events-none mt-4">
                  <div className="w-full h-[400px] bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardContent>
                <CardFooter className="flex flex-col justify-center items-center gap-4 mt-4">
                  <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        {/* Кнопки убраны из скелета, чтобы они появлялись только вместе с интерактивным слайдером */}
      </Carousel>
    </div>
  );
};
