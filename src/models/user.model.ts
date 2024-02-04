export interface User {
    id: string,
    email: string,
    bio?: string,
    avatar?: string,
    age?: string,
    occupation?: string,
    personality?: string,
    technologies?: string[],
    goals?: string[],
    frustrations?: string[]
}