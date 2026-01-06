"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const checkUser = async () => {
  const user = await currentUser();

  const existingUser = await prisma.user.findFirst({
    where: {
      clerkId: user?.id,
    },
  });

  if (existingUser) {
    return existingUser;
  }
  

  const newUser = await prisma.user.create({
    data: {
      clerkId: user?.id as string,
      email: user?.emailAddresses[0].emailAddress as string,
      userName: user?.firstName || undefined,
      imageUrl: user?.imageUrl || undefined,
      name: user?.firstName && user?.lastName 
        ? `${user?.firstName} ${user?.lastName}` 
        : user?.firstName || undefined,
    },
  });

  return newUser;
};

export { checkUser };
