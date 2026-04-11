import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const workItems = [
  {
    title: "Slider JS",
    imageUrl: "/slides/slide1.webp",
    linkUrl: "https://dmnitprof.github.io/Slider/",
  },
  {
    title: "App game",
    imageUrl: "/slides/slide2.webp",
    linkUrl: "https://remember-me-game.web.app/",
  },
  {
    title: "App game",
    imageUrl: "/slides/slide3.webp",
    linkUrl: "https://aim-game-js.web.app/",
  },
  {
    title: "Slider JS",
    imageUrl: "/slides/slide4.webp",
    linkUrl: "https://dmnitprof.github.io/Slider2JS/",
  },
  {
    title: "Test task",
    imageUrl: "/slides/slide5.webp",
    linkUrl: "https://dnikulshin.github.io/data-heroes-test/",
  },
  {
    title: "Test task",
    imageUrl: "/slides/slide6.webp",
    linkUrl: "https://test-task-slider-zeta.vercel.app/",
  },
  {
    title: "App Prototype",
    imageUrl: "/slides/slide7.webp",
    linkUrl: "https://dining-room-lemon.vercel.app/",
  },
];

async function main() {
  await prisma.work.deleteMany();

  for (const workItem of workItems) {
    await prisma.work.create({ data: workItem });
  }
}

main()
  .then(async () => {
    console.log("Seeding completed.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
