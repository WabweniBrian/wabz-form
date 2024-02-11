"use server";

import prisma from "@/lib/prisma";
import { FormSchemaType, formSchema } from "@/schema/form";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

class UserNotFoundError extends Error {}

export const getFormStats = async () => {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  const stats = await prisma.form.aggregate({
    where: { userId: user.id },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;
  let bounceRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
    bounceRate = 100 - submissionRate;
  }

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
};

export async function CreateForm(data: FormSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) throw new Error("Form not valid");

  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) throw new Error("something went wrong");

  return form.id;
}

export async function getForms() {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFormById(id: number) {
  const user = await currentUser();
  if (!user) throw new UserNotFoundError();

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function updateForm(id: number, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent,
    },
  });

  revalidatePath(`/builder/${id}`);
}

export async function publishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });

  revalidatePath(`/builder/${id}`);
}

export async function getFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    where: {
      shareUrl: formUrl,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    select: {
      content: true,
    },
  });
}

export async function submitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareUrl: formUrl,
      published: true,
    },
  });
}

export async function getFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
