import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "./app.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { User } from "./models/user.model.js";
import { Note } from "./models/note.model.js";
config({
  path: "./.env",
});
const TEST_DB_NAME = "test";
const user = {
  username: "testcase",
  password: "testcase",
};

const note = {
  title: "testing title",
  content: "testing content....",
};

let noteid;
let testuser;

describe("Note Taking Api Testing", () => {
  beforeAll(async () => {
    await mongoose.connect(`${process.env.MONGODB_URL}/${TEST_DB_NAME}`);
  }, 90000);

  afterAll(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
    await mongoose.disconnect();
    await mongoose.connection.close();
  }, 90000);

  // REGISTER USER
  describe("Register new user", () => {
    it("Register if user data not provided", async () => {
      const { statusCode } = await supertest(app).post("/api/v1/users/register").send({
        user: "",
        password: "",
      });
      // console.log(body);
      expect(statusCode).toBe(400);
    });

    it("Register new user", async () => {
      const { body } = await supertest(app).post("/api/v1/users/register").send(user);
      // console.log(body);
      expect(body.statusCode).toBe(201);
      expect(body.data.username).toBe("testcase");
      expect(body.message).toBe("New User registered Successfully");
    });

    it("Register if user doesnot exist", async () => {
      const { statusCode } = await supertest(app).post("/api/v1/users/register").send(user);
      // console.log(body);
      expect(statusCode).toBe(409);
    });
  });

  // LOGIN USER
  describe("login the user", () => {
    it("Should login user with correct password", async () => {
      const { body } = await supertest(app).post("/api/v1/users/login").send(user);
      // console.log(body);
      testuser = body.data.user;
      expect(body.statusCode).toBe(200);
      expect(body.data).toHaveProperty("accessToken");
    });

    it("Not login user with incorrect password", async () => {
      const { statusCode } = await supertest(app).post("/api/v1/users/login").send({
        user: "testcase",
        password: "wrongpassword",
      });
      // console.log(body);
      // testuser = body.data.user;
      expect(statusCode).toBe(404);
      // expect(body.data).toHaveProperty("accessToken");
    });

    // CRUD OPERTION
    describe("CRUD operation only  if user logged in", () => {
      it("Create note", async () => {
        const testUser = {
          _id: testuser._id,
        };
        const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        const { body } = await supertest(app)
          .post("/api/v1/notes/createnote")
          .send(note)
          .set("Authorization", `Bearer ${token}`);

        noteid = body.data._id;
        expect(body.statusCode).toBe(201);
        expect(body.message).toBe("new note created");
        expect(body.data.title).toBe("testing title");
      });

      describe("Get Notes", () => {
        it("Should get all notes when noteid is not provided", async () => {
          const testUser = {
            _id: testuser._id,
          };
          const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          });
          const { body } = await supertest(app)
            .get("/api/v1/notes/getnotes")
            .set("Authorization", `Bearer ${token}`);
          // console.log(body);
          expect(body.statusCode).toBe(200);
          expect(body.message).toBe("Successfully retrived all Notes");
        });

        it("Should get single notes when noteid is provided", async () => {
          const testUser = {
            _id: testuser._id,
          };
          const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          });
          const { body } = await supertest(app)
            .get(`/api/v1/notes/getnotes/${noteid}`)
            .set("Authorization", `Bearer ${token}`);
          // console.log(body);
          expect(body.statusCode).toBe(200);
          expect(body.message).toBe("Single note Successfully retrived");
        });
      });

      describe("Update Notes", () => {
        it("Should update note when noteid is provided", async () => {
          const testUser = {
            _id: testuser._id,
          };
          const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          });
          const { body } = await supertest(app)
            .patch(`/api/v1/notes//updatenote/${noteid}`)
            .send({
              title: "newtestTile",
              content: "new Test content",
            })
            .set("Authorization", `Bearer ${token}`);
          // console.log(body);
          expect(body.statusCode).toBe(200);
          expect(body.data.title).toBe("newtestTile");
          expect(body.message).toBe("note successfully updated");
        });

        it("Not update note when noteid is not provided", async () => {
          const testUser = {
            _id: testuser._id,
          };
          const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          });
          const { statusCode } = await supertest(app)
            .patch(`/api/v1/notes//updatenote/`)
            .send({
              title: "newtestTile",
              content: "new Test content",
            })
            .set("Authorization", `Bearer ${token}`);
          // console.log(body);
          expect(statusCode).toBe(404);
          // expect(body.data.title).toBe("newtestTile");
          // expect(body.message).toBe("Note successfully updated");
        });
      });

      describe("Delete Notes", () => {
        it("Should delete note when noteid is provided", async () => {
          const testUser = {
            _id: testuser._id,
          };
          const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          });
          const { body } = await supertest(app)
            .delete(`/api/v1/notes/deletenote/${noteid}`)
            .set("Authorization", `Bearer ${token}`);
          // console.log(body);
          expect(body.statusCode).toBe(200);
          // expect(body.data.title).toBe("newtestTile");
          expect(body.message).toBe("note deleted");
        });

        it("Not delete note when noteid not provided", async () => {
          const testUser = {
            _id: testuser._id,
          };
          const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          });
          const { statusCode } = await supertest(app)
            .delete(`/api/v1/notes/deleltenote/`)
            .set("Authorization", `Bearer ${token}`);
          // console.log(body);
          expect(statusCode).toBe(404);
          // expect(body.data.title).toBe("newtestTile");
          // expect(body.message).toBe("Note successfully updated");
        });
      });
    });
  });

  // LOGOUT USER
  describe("logout the user", () => {
    it("Should handle logout when the token is incorrect", async () => {
      const testUser = {
        _id: "invalidtoken",
      };
      const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      });

      const { statusCode } = await supertest(app)
        .post("/api/v1/users/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(401);
    }, 90000);

    it("Should logout the user if token is correct", async () => {
      const testUser = {
        _id: testuser._id,
      };
      const token = jwt.sign(testUser, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      });
      const respose = await supertest(app)
        .post("/api/v1/users/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(respose.body.statusCode).toBe(200);
      expect(respose.body.message).toBe("User Logged Out");
    }, 90000);

    describe("Not allowed CRUD operation after Logged out.", () => {
      it("Not Allowed Create note", async () => {
        const { statusCode } = await supertest(app).post("/api/v1/notes/createnote").send(note);
        expect(statusCode).toBe(401);
      });

      describe("Not Allowed Get Notes", () => {
        it("Should get all notes when noteid is not provided", async () => {
          const { statusCode } = await supertest(app).get("/api/v1/notes/getnotes");
          // console.log(body);
          expect(statusCode).toBe(401);
        });

        it("Should get single notes when noteid is provided", async () => {
          const { statusCode } = await supertest(app).get(`/api/v1/notes/getnotes/${noteid}`);
          expect(statusCode).toBe(401);
        });
      });

      describe("Not Allowed Update Notes", () => {
        it("Should update note when noteid is provided", async () => {
          const { statusCode } = await supertest(app)
            .patch(`/api/v1/notes//updatenote/${noteid}`)
            .send({
              title: "newtestTile",
              content: "new Test content",
            });
          // console.log(body);
          expect(statusCode).toBe(401);
        });

        it("Not update note when noteid is not provided", async () => {
          const { statusCode } = await supertest(app).patch(`/api/v1/notes//updatenote/`).send({
            title: "newtestTile",
            content: "new Test content",
          });
          expect(statusCode).toBe(404);
        });
      });

      describe("Not Allowed Delete Notes", () => {
        it("Should delete note when noteid is provided", async () => {
          const { statusCode } = await supertest(app).delete(`/api/v1/notes/deletenote/${noteid}`);
          expect(statusCode).toBe(401);
        });

        it("Not delete note when noteid not provided", async () => {
          const { statusCode } = await supertest(app).delete(`/api/v1/notes/deleltenote/`);
          expect(statusCode).toBe(404);
        });
      });
    });
  });
});
