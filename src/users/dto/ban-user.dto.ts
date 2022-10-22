import { IsString } from "class-validator"

export class BanUserDto {
	@IsString({ message: "Ban reason should be a string" })
	readonly banReason: string
}
