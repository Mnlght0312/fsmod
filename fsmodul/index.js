const express = require("express");
const cors = require("cors");
const fs = require("fs");
const PORT = 8080;
const { request, response } = require("express");
const { json } = require("body-parser");
const uuid = require("uuid");
const app = express();
app.use(cors());
app.use(express.json());
app.use(json());

const file = "./users.json";
const uniqueRandomID = uuid.v4();

app.post("/users", (req, res) => {
  const body = req.body;

  console.log(req.body);

  fs.readFile(file, "utf-8", (readErr, data) => {
    if (readErr) {
      res.json({ status: "false", message: readErr });
    }
    const obj = JSON.parse(data);

    const newUser = {
      id: uniqueRandomID,
      name: "Bold",
    };
    obj.push(newUser);

    fs.writeFile(file, JSON.stringify(obj), (err) => {
      if (err) {
        res.json({ status: true, result: obj });
      }

      res.json({ status: true, result: obj });
    });
  });
});
app.delete("/user", (req, res) => {
  const body = req.body;

  console.log(body);
  fs.readFile("./users.json", "utf-8", (readError, data) => {
    let savedData = JSON.parse(data);
    if (readError) {
      res.json({
        status: "read file error",
      });
    }
    const deleteData = savedData.filter((d) => d.id !== body.id);

    fs.writeFile("./users.json", JSON.stringify(deleteData), (writeError) => {
      if (writeError) {
        res.json({
          status: "error",
          message: writeError,
        });
      }

      res.json({ status: "true", result: deleteData });
    });
  });
});
app.get("/user", (request, response) => {
  fs.readFile("./user.json", "utf-8", (readError, data) => {
    let savedData = JSON.parse(data);
    if (readError) {
      response.json({
        status: "read file error",
      });
    }
    response.json({
      status: "success",
      data: savedData,
    });
  });
});

app.post("/user", (request, response) => {
  const body = request.body;
  fs.readFile("./user.json", "utf-8", (readError, data) => {
    let savedData = JSON.parse(data);
    if (readError) {
      response.json({
        status: "read file error",
      });
    }

    const newUser = {
      id: Date.now().toString(),
      username: body.username,
      age: body.age,
    };

    savedData.push(newUser);

    fs.writeFile("./user.json", JSON.stringify(savedData), (writeError) => {
      if (writeError) {
        response.json({
          status: "error",
        });
      } else {
        response.json({
          status: "success",
          data: savedData,
        });
      }
    });
  });
});

app.put("/user", (request, response) => {
  const body = request.body;
  fs.readFile("./user.json", "utf-8", (readError, data) => {
    let savedData = JSON.parse(data);
    if (readError) {
      response.json({
        status: "read file error",
      });
    }

    const updatedData = savedData.map((d) => {
      if (d.id === body.id) {
        (d.username = body.username), (d.age = body.age);
      }
      return d;
    });

    fs.writeFile(
      "./data/user.json",
      JSON.stringify(updatedData),
      (writeError) => {
        if (writeError) {
          response.json({
            status: "error",
          });
        } else {
          response.json({
            status: "success",
            data: updatedData,
          });
        }
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
