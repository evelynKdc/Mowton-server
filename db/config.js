require("colors");
const mongoose = require("mongoose");

const connexion = async () => {
  try {
    const db = await mongoose.connect(process.env.URI);

    console.log(`Database connected to ${db.Connection.name}`.bgGreen);
  } catch (error) {
    console.log(error);
    throw new Error("Error en la base de datos".bgRed);
  }
};

module.exports = { connexion };
