const express = require("express");
const morgan = require("morgan");
const process = require("node:process");
const bcrypt = require("bcrypt");

const boottrap = () => {
  const app = express();

  app.use(morgan("combined"));

  app.get("/", (req, res) => {
    res.send("Hello Azure!");
  });

  app.get("/login/:id", async (req, res) => {
    // const hashed = await hashing();

    res.status(200).json({
      username: "canhtvee",
      password: "hashed",
    });
  });

  app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
  });
};

const hashing = async () => {
  console.log("process id:", process.pid);
  return await bcrypt.hash("mypassword", 10);
};

const cluster = require("node:cluster");
const numCPUs = require("node:os").availableParallelism();

console.log("numCPUs", numCPUs);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  boottrap();

  console.log(`Worker ${process.pid} started`);
}

// boottrap();
