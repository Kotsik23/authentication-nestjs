import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Observable } from "rxjs"
import { Request } from "express"
import { JwtService } from "@nestjs/jwt"
import { User } from "../users/users.model"
import { ROLES_KEY } from "../decorators/roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly reflector: Reflector
	) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		try {
			const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
				context.getHandler(),
				context.getClass(),
			])

			if (!requiredRoles) {
				return true
			}

			const request = context.switchToHttp().getRequest<Request>()
			const authHeader = request.headers.authorization

			const bearer = authHeader.split(" ")[0]
			const token = authHeader.split(" ")[1]

			if (bearer !== "Bearer" || !token) {
				throw new UnauthorizedException("Unauthorized")
			}

			const user = this.jwtService.verify<User>(token)

			request.user = user

			return user.roles.some(role => requiredRoles.includes(role.name))
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}
}
