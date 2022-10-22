import { IsString } from "class-validator"

export class CreateRoleDto {
	@IsString({ message: "Role name should be a string" })
	readonly name: string
}
