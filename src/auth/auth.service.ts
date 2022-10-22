import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { JwtService } from "@nestjs/jwt"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { IAccessToken } from "./interfaces/token.interface"
import { compare, genSalt, hash } from "bcrypt"
import { User } from "../users/users.model"
import { ConfigService } from "@nestjs/config"
import { ITokenPayload } from "./interfaces/token-payload.interface"
import { ITokensResponse } from "./interfaces/tokens-response.interface"
import { Request, Response } from "express"

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async register(dto: CreateUserDto, res: Response): Promise<IAccessToken> {
		const candidate = await this.usersService.getUserByEmail(dto.email)

		if (candidate) {
			throw new BadRequestException("This email is already exists")
		}

		const salt = await genSalt(6)

		const hashedPassword = await hash(dto.password, salt)

		const user = await this.usersService.createUser({
			...dto,
			password: hashedPassword,
		})

		const tokenPayload = this.returnUserPayload(user)
		const tokens = await this.generateTokens(tokenPayload)

		this.setRefreshTokenToCookie(res, tokens.refreshToken)
		await this.usersService.setRefreshToken(user.id, tokens.refreshToken)

		return {
			accessToken: tokens.accessToken,
		}
	}

	async login(
		dto: Omit<CreateUserDto, "username">,
		res: Response
	): Promise<IAccessToken> {
		const user = await this.validateUser(dto)

		const tokenPayload = this.returnUserPayload(user)
		const tokens = await this.generateTokens(tokenPayload)

		this.setRefreshTokenToCookie(res, tokens.refreshToken)
		await this.usersService.setRefreshToken(user.id, tokens.refreshToken)

		return {
			accessToken: tokens.accessToken,
		}
	}

	async logout(userId: number, req: Request, res: Response): Promise<any> {
		await this.usersService.removeRefreshToken(userId)

		const cookies = req.cookies

		if (!cookies.jwtRefreshToken) {
			throw new HttpException("No content", HttpStatus.NO_CONTENT)
		}

		res.clearCookie("jwtRefreshToken", { httpOnly: true, sameSite: "none" })

		return {
			message: "Successfully logged out",
		}
	}

	async refresh(req: Request, res: Response) {
		try {
			const refreshToken = req.cookies?.jwtRefreshToken

			if (!refreshToken) {
				throw new UnauthorizedException("Unauthorized")
			}

			const userData = await this.validateRefreshToken(refreshToken)
			const user = await this.usersService.getUserById(userData.id)

			if (!userData || !user) {
				throw new UnauthorizedException("Unauthorized")
			}

			const tokenPayload = this.returnUserPayload(user)
			const tokens = await this.generateTokens(tokenPayload)

			this.setRefreshTokenToCookie(res, tokens.refreshToken)
			await this.usersService.setRefreshToken(user.id, tokens.refreshToken)

			return {
				accessToken: tokens.accessToken,
			}
		} catch (error) {
			throw new UnauthorizedException(error.message)
		}
	}

	private returnUserPayload(user: User): ITokenPayload {
		return {
			id: user.id,
			roles: user.roles,
		}
	}

	private async generateTokens(payload: ITokenPayload): Promise<ITokensResponse> {
		const accessToken = this.jwtService.sign(payload)
		const refreshToken = this.jwtService.sign(payload, {
			secret: this.configService.get<string>("REFRESH_TOKEN_SECRET_KEY"),
			expiresIn: "30d",
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	private setRefreshTokenToCookie(res: Response, refreshToken): Response {
		return res.cookie("jwtRefreshToken", refreshToken, {
			httpOnly: true,
			sameSite: "none",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		})
	}

	private async validateRefreshToken(refreshToken: string): Promise<ITokenPayload> {
		return await this.jwtService.verify(refreshToken, {
			secret: this.configService.get("REFRESH_TOKEN_SECRET_KEY"),
		})
	}

	private async validateUser(dto: Omit<CreateUserDto, "username">): Promise<User> {
		const user = await this.usersService.getUserByEmail(dto.email)

		if (!user) {
			throw new BadRequestException("Incorrect email or password")
		}

		const passwordEquals = await compare(dto.password, user.password)

		if (!passwordEquals) {
			throw new BadRequestException("Incorrect email or password")
		}

		return user
	}
}
