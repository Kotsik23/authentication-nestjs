import { IsEmail, IsString, Length } from "class-validator"

export class CreateUserDto {
	@IsString({ message: "Username should be a string" })
	readonly username: string

	@IsString({ message: "Email should be a string" })
	@IsEmail({}, { message: "Incorrect email" })
	readonly email: string

	@Length(4, 16, { message: "Password should be between 4 and 16 characters" })
	@IsString({ message: "Password should be a string" })
	readonly password: string
}
