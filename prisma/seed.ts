import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

async function main() {
  const hash = await bcrypt.hash(process.env.SEED_USER_PASSWORD ?? "change-me-now!", 12);

  await db.user.upsert({
    where: { email: "admin@adofai.net.local" },
    create: {
      username: "idp_admin",
      email: "admin@adofai.net.local",
      passwordHash: hash,
    },
    update: { passwordHash: hash },
  });

  await db.oAuthClient.upsert({
    where: { clientId: "adofai_verse_web" },
    create: {
      clientId: "adofai_verse_web",
      name: "ADOFAI.VERSE (example)",
      redirectUris: [
        "http://localhost:3000/api/auth/callback/adofai",
        "https://adofai.net/api/auth/callback/adofai",
      ],
      isPublic: true,
    },
    update: {
      redirectUris: [
        "http://localhost:3000/api/auth/callback/adofai",
        "https://adofai.net/api/auth/callback/adofai",
      ],
    },
  });

  console.log("Seed OK — user admin@adofai.net.local / password from SEED_USER_PASSWORD; OAuth client adofai_verse_web");
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
