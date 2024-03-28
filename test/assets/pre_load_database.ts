import { db, sequelize } from "../../src/database";


async function main() {
  await sequelize.sync({ force: true });
  for (var i = 0; i < 10; i++) {
    await db.People.create({
      address: `QUADRA ${i}`
    })
  }
}

main().then(() => {
  console.log("Pre load database completed! \n\n");
  process.exit(0);
}).catch((err) => {
  console.log(err);
  process.exit(1);
});