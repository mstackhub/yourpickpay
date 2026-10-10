import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

const defaultToken = "eyJhcGlLZXkiOiJza19saXZlXzFmZGQ4ZGE2MDMyMGJjMTlhODIwNDBmZTBhYzUxNWQ0M2IyZDJhYjNlNzQ2NGY4OWY4ZWFkYzU3ZWMzYTcyMzgiLCJhcHBJZCI6InVhcTJzZTQ3b2kiLCJyZWdpb25zIjpbInNlYTEiXX0=";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN || defaultToken,
  },
});
