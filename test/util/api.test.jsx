import { describe, it, expect } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchTickets } from "../../src/util/api.jsx";

describe("API helper methods", () => {
  const mock = new MockAdapter(axios);
  const url = "https://ticketguru.hellmanstudios.fi/api";
  const userName = "salesperson@test.com";
  const userPass = "salesperson";
  //const authHeader = `Basic ${btoa(`${userName}:${userPass}`)}`;

  afterEach(() => {
    mock.reset();
  });

  /**
   * Simple unit test for the fetchTickets function
   *
   */
  it("fetchTickets should include event data", async () => {
    const ticketIds = [1, 2, 3];

    // Fake response
    const mockResponse = [
      { id: 1, event: { id: 101, name: "Event 1" } },
      { id: 2, event: { id: 102, name: "Event 2" } },
      { id: 3, event: { id: 103, name: "Event 3" } },
    ];

    //Fake Get request
    mock
      .onGet(`${url}/tickets`, {
        params: { ids: ticketIds },
      })
      .reply(200, mockResponse);

    // Call the function and validate the response
    const result = await fetchTickets({ url, userName, userPass }, ticketIds);

    console.log("test response", result);

    expect(result[0].event).toBeDefined(); // Check if the first ticket includes event data
    expect(result[0].event.name).toBe("Event 1"); // Validate the event name
  });
});
