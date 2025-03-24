import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper to save base64 image
async function saveImage(base64: string, mimeType: string): Promise<string> {
  const extension = mimeType.split("/")[1];
  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(base64, "base64");
  await fs.promises.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

const app = new Elysia()
  .use(cors())
  .get("/", () => "Twitter Clone API")

  // Create post
  .post(
    "/post",
    async ({ body }) => {
      const { text, image, mimeType, userId } = body as {
        text: string;
        image?: string;
        mimeType?: string;
        userId: string;
      };

      let imageUrl;
      if (image && mimeType) {
        imageUrl = await saveImage(image, mimeType);
      }

      const post = await prisma.post.create({
        data: {
          text,
          imageUrl,
          userId,
        },
      });

      return { success: true, post };
    },
    {
      body: t.Object({
        text: t.String(),
        image: t.Optional(t.String()),
        mimeType: t.Optional(t.String()),
        userId: t.String(),
      }),
    }
  )

  // Create comment
  .post(
    "/post/:id/comment",
    async ({ params, body }) => {
      const { text, image, mimeType, userId } = body as {
        text: string;
        image?: string;
        mimeType?: string;
        userId: string;
      };
      const { id: postId } = params;

      let imageUrl;
      if (image && mimeType) {
        imageUrl = await saveImage(image, mimeType);
      }

      const comment = await prisma.comment.create({
        data: {
          text,
          imageUrl,
          userId,
          postId,
        },
      });

      return { success: true, comment };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        text: t.String(),
        image: t.Optional(t.String()),
        mimeType: t.Optional(t.String()),
        userId: t.String(),
      }),
    }
  )

  // Create user
  .post(
    "/user",
    async ({ body }) => {
      const { name, username, bio, profilePicture, mimeType, superUser } =
        body as {
          name: string;
          username: string;
          bio?: string;
          profilePicture?: string;
          mimeType?: string;
          superUser?: boolean;
        };

      // Check if username is already taken
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return { success: false, error: "Username is already taken" };
      }

      let _base64Image;
      let _mimeType;
      if (!profilePicture && !mimeType) {
        // Fetch random image from picsum.photos if no profile picture is provided
        try {
          const response = await fetch("https://picsum.photos/200/300");
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          _base64Image = buffer.toString("base64");
          _mimeType = "image/jpeg";
        } catch (error) {
          console.error("Error fetching random profile picture:", error);
        }
      } else {
        _base64Image = profilePicture;
        _mimeType = mimeType;
      }

      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          username,
          bio,
          profilePicture: _base64Image,
          mimeType: _mimeType,
          superUser: superUser || false,
        },
      });

      // 1. If new user is a superUser, make all existing users follow them
      if (superUser) {
        const allUsers = await prisma.user.findMany({
          where: { id: { not: user.id } },
          select: { id: true },
        });

        if (allUsers.length > 0) {
          await prisma.follow.createMany({
            data: allUsers.map((existingUser) => ({
              followerId: existingUser.id,
              followingId: user.id,
            })),
            skipDuplicates: true,
          });
        }
      } else {
        await prisma.follow.create({
          data: {
            followerId: "1",
            followingId: user.id,
          },
        });
      }

      // 2. Make new user follow all superUsers
      const superUsers = await prisma.user.findMany({
        where: {
          superUser: true,
          id: { not: user.id }, // Don't follow yourself
        },
        select: { id: true },
      });

      if (superUsers.length > 0) {
        await prisma.follow.createMany({
          data: superUsers.map((superUser) => ({
            followerId: user.id,
            followingId: superUser.id,
          })),
          skipDuplicates: true,
        });
      }

      return { success: true, user };
    },
    {
      body: t.Object({
        name: t.String(),
        username: t.String(),
        bio: t.Optional(t.String()),
        profilePicture: t.Optional(t.String()),
        mimeType: t.Optional(t.String()),
        superUser: t.Optional(t.Boolean()),
      }),
    }
  )

  // Follow a user
  .get(
    "/follow/:username",
    async ({ params, query }) => {
      const { username } = params;
      const { followerId } = query;

      if (!followerId) {
        return { success: false, error: "Follower ID is required" };
      }

      const userToFollow = await prisma.user.findUnique({
        where: { username },
      });

      if (!userToFollow) {
        return { success: false, error: "User not found" };
      }

      // Check if already following
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId: userToFollow.id,
        },
      });

      if (existingFollow) {
        // If already following, unfollow
        await prisma.follow.delete({
          where: { id: existingFollow.id },
        });
        return { success: true, action: "unfollowed" };
      }

      // Create follow relationship
      await prisma.follow.create({
        data: {
          followerId,
          followingId: userToFollow.id,
        },
      });

      return { success: true, action: "followed" };
    },
    {
      params: t.Object({
        username: t.String(),
      }),
      query: t.Object({
        followerId: t.String(),
      }),
    }
  )

  // Get user posts
  .get(
    "/posts/:username",
    async ({ params }) => {
      const { username } = params;

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      const posts = await prisma.post.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return { success: true, posts };
    },
    {
      params: t.Object({
        username: t.String(),
      }),
    }
  )

  // Get home feed
  .get(
    "/feed",
    async ({ query }) => {
      const { userId } = query;

      if (!userId) {
        return { success: false, error: "User ID is required" };
      }

      // Get IDs of users that the current user is following
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);

      // Add the user's own ID to see their posts too
      followingIds.push(userId);

      // Get posts from followed users and the user themselves
      const posts = await prisma.post.findMany({
        where: {
          userId: { in: followingIds },
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        take: 50,
      });

      return { success: true, posts };
    },
    {
      query: t.Object({
        userId: t.String(),
      }),
    }
  )

  // Get user profile
  .get(
    "/user/:username",
    async ({ params, query }) => {
      const { username } = params;
      const { currentUserId } = query;

      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          profilePicture: true,
          createdAt: true,
          _count: {
            select: {
              followers: true,
              following: true,
              posts: true,
            },
          },
        },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      let isFollowing = false;

      if (currentUserId) {
        const followRecord = await prisma.follow.findFirst({
          where: {
            followerId: currentUserId,
            followingId: user.id,
          },
        });

        isFollowing = !!followRecord;
      }

      return {
        success: true,
        user: {
          ...user,
          isFollowing,
        },
      };
    },
    {
      params: t.Object({
        username: t.String(),
      }),
      query: t.Object({
        currentUserId: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/userById/:id",
    async ({ params, query }) => {
      const { id } = params;
      const { currentUserId } = query;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          profilePicture: true,
          createdAt: true,
          _count: {
            select: {
              followers: true,
              following: true,
              posts: true,
            },
          },
        },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      let isFollowing = false;

      if (currentUserId) {
        const followRecord = await prisma.follow.findFirst({
          where: {
            followerId: currentUserId,
            followingId: user.id,
          },
        });

        isFollowing = !!followRecord;
      }

      return {
        success: true,
        user: {
          ...user,
          isFollowing,
        },
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        currentUserId: t.Optional(t.String()),
      }),
    }
  )

  // Get a post with comments
  .get(
    "/post/:id",
    async ({ params }) => {
      const { id } = params;

      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          user: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      if (!post) {
        return { success: false, error: "Post not found" };
      }

      return { success: true, post };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  // Serve static files
  .get(
    "/uploads/:file",
    ({ params }) => {
      const filePath = path.join(uploadDir, params.file);
      try {
        return new Response(fs.readFileSync(filePath)); // Use standard Response object instead of Bun.file
      } catch (error) {
        return { success: false, error: "File not found" };
      }
    },
    {
      params: t.Object({
        file: t.String(),
      }),
    }
  )

  // Get all non-superuser user IDs
  .get("/users", async () => {
    const users = await prisma.user.findMany({
      where: {
        superUser: false,
      },
      select: {
        id: true,
      },
    });

    return { success: true, users };
  })

  .listen(3000);

console.log(
  `Twitter clone API is running at ${app.server?.hostname}:${app.server?.port}`
);
