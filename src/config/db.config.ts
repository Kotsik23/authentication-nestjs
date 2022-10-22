import { ConfigService } from "@nestjs/config"
import { SequelizeModuleOptions } from "@nestjs/sequelize"
import { User } from "../users/users.model"
import { Role } from "../roles/roles.model"
import { UserRoles } from "../roles/user-roles.model"

export const getSequelizeConfig = async (
	configService: ConfigService
): Promise<SequelizeModuleOptions> => {
	return {
		dialect: "postgres",
		host: configService.get("POSTGRES_HOST"),
		port: +configService.get("POSTGRES_PORT"),
		username: configService.get("POSTGRES_USER"),
		password: configService.get("POSTGRES_PASSWORD"),
		database: configService.get("POSTGRES_DB"),
		models: [User, Role, UserRoles],
		autoLoadModels: true,
		synchronize: true,
		// sync: { force: true },
	}
}
