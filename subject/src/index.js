const express = require("express");
const routerSubject = require("./controllers/subject-controller");

const app = express();
const port = 3002;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", routerSubject);


app.listen(port, () => {
    console.log(`Subject service listening on port ${port}`);
})