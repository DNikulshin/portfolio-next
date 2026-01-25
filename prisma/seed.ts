import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const workItems = [
  {
    title: "Slider JS",
    imageUrl: "/slides/slide1.webp",
    linkPath: "https://dmnitprof.github.io/Slider/",
  },
  {
    title: "App game",
    imageUrl: "/slides/slide2.webp",
    linkPath: "https://remember-me-game.web.app/",
  },
  {
    title: "App game",
    imageUrl: "/slides/slide3.webp",
    linkPath: "https://aim-game-js.web.app/",
  },
  {
    title: "Slider JS",
    imageUrl: "/slides/slide4.webp",
    linkPath: "https://dmnitprof.github.io/Slider2JS/",
  },
  {
    title: "Test task",
    imageUrl: "/slides/slide5.webp",
    linkPath: "https://dnikulshin.github.io/data-heroes-test/",
  },
  {
    title: "Test task",
    imageUrl: "/slides/slide6.webp",
    linkPath: "https://test-task-slider-zeta.vercel.app/",
  },
  {
    title: "App Prototype",
    imageUrl: "/slides/slide7.webp",
    linkPath: "https://dining-room-lemon.vercel.app/",
  },
];

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "admin@admin.ru",
      passwordHash:
        "$2b$10$Rz3FR/64kTcqmf4Zj6I.Se4DbuPuCNwuQCQSC9P/efottR949gTOm",
    },
  });

  for (const workItem of workItems) {
    await prisma.work.create({
      data: {
        title: workItem.title,
        imageUrl: workItem.imageUrl,
        linkUrl: workItem.linkPath,
        userId: user.id,
      },
    });
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
