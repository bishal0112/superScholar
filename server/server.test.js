const request = require("supertest");
const app = require("./server");
describe("Test Post /boards", () => {
	test("It should respond with 200 Created", async () => {
		const response = await request(app)
			.post("/boards")
			.send({
				title: "Create a new project",
			})
			.expect("Content-Type", /json/)
			.expect(200);
	});
});
