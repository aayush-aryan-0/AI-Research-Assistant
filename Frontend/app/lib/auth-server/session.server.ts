"use server";

import { getSession } from "./session";

export async function createPost() {
    const session = await getSession();

    if (!session) {
        throw new Error("Unauthorized");
    }

    // create post
}