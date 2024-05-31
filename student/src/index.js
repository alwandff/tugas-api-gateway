const express = require("express");
const routerStudent = require("./controllers/student-controller");

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));    
app.use("/", routerStudent);

app.listen(port, () => {
    console.log(`Student service listening on port ${port}`);
});
