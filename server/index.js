const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Asana API configuration
const asanaApiUrl = process.env.ASANA_API_URL;
const asanaToken = process.env.ASANA_ACCESS_TOKEN;

// Basic health check endpoint
app.get("/", (req, res) => {
	res.json({ message: "Asana Proxy Server is running" });
});

// Generic Asana proxy endpoint
app.post("/api/asanaproxy", async (req, res) => {
	try {
		const {
			apiPath,
			queryParams = {},
			postData = {},
			method = "GET",
			apiHeaders = {}
		} = req.body;

		if (!apiPath) {
			return res.status(400).json({ error: "apiPath is required" });
		}

		// Construct the full Asana API URL with query parameters
		let fullUrl = `${asanaApiUrl}${apiPath}`;

		// Add query parameters if they exist
		if (Object.keys(queryParams).length > 0) {
			const urlParams = new URLSearchParams();
			for (const [key, value] of Object.entries(queryParams)) {
				if (value !== null && value !== undefined) {
					urlParams.append(key, value);
				}
			}
			fullUrl += `?${urlParams.toString()}`;
		}

		// Configure the request options
		const requestConfig = {
			method,
			url: fullUrl,
			headers: {
				authorization: "Bearer " + asanaToken,
				"Content-Type": "application/json",
				accept: "application/json",
				...apiHeaders
			}
		};

		// Add request body data for non-GET requests
		if (method !== "GET" && Object.keys(postData).length > 0) {
			requestConfig.data = postData;
		}

		// Make the request to Asana API
		const response = await axios(requestConfig);

		// Return the Asana API response to the client
		return res.status(response.status).json(response.data);
	} catch (error) {
		console.error(`Error proxying Asana request:`, error.message);

		if (error.response) {
			// Return the error status and data from Asana
			return res.status(error.response.status).json({
				error: "Error from Asana API",
				details: error.response.data
			});
		}

		return res.status(500).json({ error: "Failed to proxy request to Asana API" });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
