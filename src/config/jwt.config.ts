import { JwtModuleOptions } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

export const getJwtConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => {
	return {
		secret: configService.get("ACCESS_TOKEN_SECRET_KEY"),
		signOptions: {
			expiresIn: "15m",
		},
	}
}
