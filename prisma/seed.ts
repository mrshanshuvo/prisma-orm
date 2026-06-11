import prisma from "../src/config/db";

async function main() {
  console.log("Cleaning up database...");
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleaned.");

  console.log("Seeding 10 users...");
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        profilePic: `https://api.dicebear.com/7.x/adventurer/svg?seed=user${i}`,
      },
    });
    users.push(user);
  }

  console.log("Seeding 10 posts...");
  const posts = [];
  for (let i = 1; i <= 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const post = await prisma.post.create({
      data: {
        title: `Post Title ${i}`,
        content: `This is the content of post number ${i}.`,
        published: Math.random() > 0.3,
        authorId: randomUser.id,
        images: [`https://picsum.photos/seed/post${i}/600/400`],
        videos: [`https://www.w3schools.com/html/mov_bbb.mp4`],
      },
    });
    posts.push(post);
  }

  console.log("Seeding 20 comments...");
  const emojisPool = ["😀", "❤️", "🔥", "🚀", "🙌", "🎉", "💯"];
  for (let i = 1; i <= 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    await prisma.comment.create({
      data: {
        content: `This is comment number ${i}`,
        postId: randomPost.id,
        authorId: randomUser.id,
        image: `https://picsum.photos/seed/comment${i}/200/200`,
        emojis: [
          emojisPool[Math.floor(Math.random() * emojisPool.length)],
          emojisPool[Math.floor(Math.random() * emojisPool.length)],
        ],
      },
    });
  }

  console.log("Seeding 50 likes...");
  const allPairs: { postId: number; userId: number }[] = [];
  for (const post of posts) {
    for (const user of users) {
      allPairs.push({ postId: post.id, userId: user.id });
    }
  }

  // Shuffle pairs
  for (let i = allPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPairs[i], allPairs[j]] = [allPairs[j], allPairs[i]];
  }

  // Take 50 unique pairs
  const likesToCreate = allPairs.slice(0, 50);
  for (const pair of likesToCreate) {
    await prisma.like.create({
      data: pair,
    });
  }

  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
