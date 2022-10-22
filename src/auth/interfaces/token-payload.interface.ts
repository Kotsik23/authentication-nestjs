import { Role } from "../../roles/roles.model"

export interface ITokenPayload {
	id: number
	roles: Role[]
}
