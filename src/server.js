const express = require("express");
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling");
const projectRoutes = require("./projects");

const server = express();
const port = process.env.PORT || 3007;

server.use(express.json());
server.use("/projects", projectRoutes);
//importing the errorhandlers
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);
//giving the port and a cute message to the console
server.listen(port, () => {
  console.log(
    "The serverino is running around, dont chase him, ah go in route",
    process.env.PORT,
    "to the sessibeastShop"
  );
});
