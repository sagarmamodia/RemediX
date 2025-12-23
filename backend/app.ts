import express from "express";

const app = express();

app.get("/health", (req, res) => {
    res.json({success: true, data: {}})
})

export default app;