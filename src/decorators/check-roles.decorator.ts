import { applyDecorators, UseGuards } from "@nestjs/common"
import { Roles } from "./roles.decorator"
import { RolesGuard } from "../guards/roles.guard.dto"

export const CheckRoles = (...roles: string[]) => {
	return applyDecorators(Roles(...roles), UseGuards(RolesGuard))
}
