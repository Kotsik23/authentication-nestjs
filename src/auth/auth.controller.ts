import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { IAccessToken } from "./interfaces/token.interface"
import { Request, Response } from "express"
import { Auth } from "./guards/auth.guard"
import { CurrentUser } from "./decorators/current-user.decorator"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() dto: Omit<CreateUserDto, "username">,
		@Res({ passthrough: true }) res: Response
	): Promise<IAccessToken> {
		return await this.authService.login(dto, res)
	}

	@Post("register")
	async register(
		@Body() dto: CreateUserDto,
		@Res({ passthrough: true }) res: Response
	): Promise<IAccessToken> {
		return await this.authService.register(dto, res)
	}

	@Auth()
	@Delete("logout")
	async logout(
		@CurrentUser("id") userId: string,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	): Promise<any> {
		return await this.authService.logout(+userId, req, res)
	}

	@Get("refresh")
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return await this.authService.refresh(req, res)
	}

	@Auth()
	@Get("check")
	async check(@Req() req: Request) {
		return req.user
	}
}
