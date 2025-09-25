const { AppDataSource } = require("./../config/data-source");

AppDataSource.initialize()
  .then(async () => {
    console.log("connected to database successfully");

    const friendsRepo = AppDataSource.getRepository("friends");
    const friends = await friendsRepo.find();
    console.log(friends);
  })
  .catch(err => {
    console.error("DB connection error:", err);
  });
