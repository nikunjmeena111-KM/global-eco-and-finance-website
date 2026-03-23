import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dashboardRoutes from "./dashboard/dashboard.routes.js"
import exchangeRoutes from "./routes/exchangeRate.routes.js";
import macroRoutes from "./routes/macroIndicators.routes.js";
import calculatorRoutes from "./routes/calculator.routes.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import helmet from "helmet";

const app= express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true})) 
app.use(express.static("public"))
app.use(cookieParser())

app.use(globalRateLimiter);

app.use("/api/v1/dashboard", dashboardRoutes)

app.use("/api/v1/exchangerates", exchangeRoutes);

app.use("/api/v1/macro", macroRoutes);

app.use("/api/v1/calculators", calculatorRoutes);

export {app}