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
      emailVerified: true,
    },
    update: { passwordHash: hash, emailVerified: true },
  });

  await db.oAuthClient.upsert({
    where: { clientId: "adofai_verse_web" },
    create: {
      clientId: "adofai_verse_web",
      name: "ADOFAI.VERSE",
      redirectUris: [
        "http://localhost:3000/api/auth/oauth/callback",
        "https://adofai.net/api/auth/oauth/callback",
      ],
      isPublic: true,
    },
    update: {
      redirectUris: [
        "http://localhost:3000/api/auth/oauth/callback",
        "https://adofai.net/api/auth/oauth/callback",
      ],
    },
  });

  await db.oAuthClient.upsert({
    where: { clientId: "adofai_online_contest" },
    create: {
      clientId: "adofai_online_contest",
      name: "ADOFAI Online Contest",
      redirectUris: [
        "http://localhost:3001/api/auth/oauth/callback",
        "https://contest.adofai.net/api/auth/oauth/callback",
      ],
      isPublic: true,
    },
    update: {
      redirectUris: [
        "http://localhost:3001/api/auth/oauth/callback",
        "https://contest.adofai.net/api/auth/oauth/callback",
      ],
    },
  });

  console.log("Seed OK — OAuth clients adofai_verse_web & adofai_online_contest; admin user emailVerified:true");
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
