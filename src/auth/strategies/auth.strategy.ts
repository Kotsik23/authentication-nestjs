import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersService } from "../../users/users.service"
import { User } from "../../users/users.model"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get("ACCESS_TOKEN_SECRET_KEY"),
		})
	}

	async validate({ id }: Pick<User, "id">) {
		return await this.usersService.getUserById(id)
	}
}
