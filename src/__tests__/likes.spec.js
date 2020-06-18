const request = require("supertest");
const app = require("../app");
const toResult = require("../util");

describe("Likes", () => {
  it("should be able to give a like to the repository", async done => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"]
      });

    let response = await request(app).post(
      `/repositories/${repository.body.data.id}/like`
    );
    
    let result = toResult({ likes: 1});
 
    expect(response.body).toMatchObject(result);

    response = await request(app).post(
      `/repositories/${repository.body.data.id}/like`
    );

    result = toResult({ likes: 2});

    expect(response.body).toMatchObject(result);
    done();
  });

  it("should not be able to like a repository that does not exist", async done => {
    const response = await request(app)
      .post(`/repositories/123/like`);

      expect(response.statusCode).toBe(400);

      done();
  });
});
