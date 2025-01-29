export const schema = `#graphql

type Coctel {
    id: ID!
    name: String!
    ingredients: [String!]!
    instructions: String!
    numberOfIngredients: Int!
}

type Receta {
    name: String!
    fat_total_g: Float!
    sodium_mg: Int!
    potassium_mg: Int!
    carbohydrates_total_g: Float!
    fiber_g: Float!
    sugar_g: Float!
}

type Query {
    getAllCocktails: [Coctel!]!
    getCocktail(name: String!): Coctel
    getRecipe(name: String!): Receta
}

type Mutation {
    addRecipe(name: String!): Receta!
    updateRecipe(
        id: String!,
        fat_total_g: Float,
        sodium_mg: Int,
        potassium_mg: Int,
        carbohydrates_total_g: Float,
        fiber_g: Float,
        sugar_g: Float,
    ): Receta!
    deleteRecipe(id: String!): Boolean!
}


`