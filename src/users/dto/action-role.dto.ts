import { IsNumber } from "class-validator"
import { CreateRoleDto } from "../../roles/dto/create-role.dto"

export class ActionRoleDto extends CreateRoleDto {
	@IsNumber({}, { message: "UserId should be a number" })
	readonly userId: number
}
