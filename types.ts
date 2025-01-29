import {OptionalId, ObjectId, Double} from "mongodb";

export type CoctelModel = OptionalId<{
    name: string,
    ingredients:  ObjectId[],
    instructions: string,
}>

export type RecetaModel = OptionalId<{
    name: string,
    fat_total_g: Double,
    sodium_mg: number,
    potassium_mg: number,
    carbohydrates_total_g: Double,
    fiber_g: Double,
    sugar_g: Double
}>

/*export type Coctel = {
    id: string,
    name: string,
    ingredients: string[],
    instructions: string,
    numberOfInstructions: number
}

export type Receta = {
    name: string,
    fat_total_g: number,
    sodium_mg: number,
    potassium_mg: number,
    carbohydrates_total_g: number,
    fiber_g: number,
    sugar_g: number
}*/

export type API_COCKTAIL = {
    name: string,
    ingredients: string[],
    instructions: string,
}