const { AppDataSource } = require('../config/data-source.js');

const uploadFile = async (data, cb) => {
  try {
    const userRepository = AppDataSource.getRepository("User");

    // check if user exists
    const user = await userRepository.findOneBy({ _id: data._id });
    if (!user) {
      return cb({ error: true, msg: "User not found" });
    }

    await userRepository.update(
      { _id: data._id },  
      { dp: data.fileData } 
    );

    cb({ error: false, msg: "dp uploaded successfully" });
  } catch (err) {
    console.error(err);
    cb({ error: true, msg: "Something went wrong please try later" });
  }
};

module.exports = uploadFile;
