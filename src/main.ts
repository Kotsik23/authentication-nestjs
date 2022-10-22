import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
	const PORT = process.env.PORT || 8001

	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix("api")
	app.use(cookieParser())
	app.enableCors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})

	await app.listen(PORT)
}

bootstrap()
