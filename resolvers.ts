import { Collection, Double } from "mongodb";
import { CoctelModel, RecetaModel } from "./types.ts";
import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

type Context = {
    coctelColletion: Collection<CoctelModel>
    recetaColletion: Collection<RecetaModel>
}

export const resolvers = {
    Coctel: {
        id: (parent: CoctelModel) => {
            return parent._id!.toString();
        },
        numberOfIngredients: (parent: CoctelModel) => {
            return parent.ingredients.length;
        }
    },
    Query: {
        getAllCocktails: async(
            _: unknown,
            __: unknown,
            ctx: Context
        ): Promise<CoctelModel[]> =>{
            const cockteilsDB = await ctx.coctelColletion.find().toArray();

            return cockteilsDB;
        },
        getCocktail: async(
            _: unknown,
            args: {name: string},
            ctx: Context
        ): Promise<CoctelModel|null> => {
            const coctelDB = await ctx.coctelColletion.findOne({name: args.name});

            return coctelDB;
        },

        getRecipe: async(
            _: unknown,
            args: {name: string},
            ctx: Context
        ): Promise<RecetaModel|null> => {
            const recetaDB = await ctx.recetaColletion.findOne({name: args.name});

            return recetaDB;
        } 
    },
    Mutation: {
        addRecipe: async(
            _: unknown,
            args: {name: string},
            ctx: Context
        ):Promise<RecetaModel> => {
            const receta = await ctx.recetaColletion.findOne({name: args.name});

            if(receta){
                throw new GraphQLError("La receta ya existe");
            }
                
            const API_KEY = Deno.env.get('API_KEY');
            const url = 'https://api.api-ninjas.com/v1/nutrition?query=' + args.name;
            const data = await fetch(url, {headers: { 'X-Api-Key': API_KEY}});

            if(data.status !== 200){
                throw new GraphQLError("No se ha podido hacer el fetch de la API_Recipes");
            }

            const respuesta = await data.json();

            const {insertedId} = await ctx.recetaColletion.insertOne({ 
                name: args.name,
                fat_total_g: respuesta[0].fat_total_g,
                sodium_mg: respuesta[0].sodium_mg,
                potassium_mg: respuesta[0].potassium_mg,
                carbohydrates_total_g: respuesta[0].carbohydrates_total_g,
                fiber_g: respuesta[0].fiber_g,
                sugar_g: respuesta[0].sugar_g
            }); 

            if(insertedId){
                const recipe = await ctx.recetaColletion.findOne({_id: insertedId});
                if(recipe){
                    return recipe;
                }else {
                    throw new GraphQLError("No se ha podido mostrar");
                }   
            }else {
                throw new GraphQLError("No se ha podido añadir la receta");
            }
        },
        deleteRecipe: async(
            _: unknown,
            args: {id: string},
            ctx: Context
        ): Promise<boolean> => {
            const {deletedCount} = await ctx.recetaColletion.deleteOne({_id: new ObjectId(args.id)});

            if(deletedCount){
                return true;
            }else{
                return false;
            }
        },
        updateRecipe: async(
            _:unknown,
            args: {id: string, fat_total_g?: number, sodium_mg?: number,  potassium_mg?: number, carbohydrates_total_g?: number, fiber_g?: number, sugar_g?: number},
            ctx: Context
        ): Promise<RecetaModel> => {
            const datosModificar: Partial<RecetaModel> = {};
            if(!args.fat_total_g && !args.sodium_mg && !args.potassium_mg && !args.carbohydrates_total_g && !args.fiber_g && !args.sugar_g){
                throw new GraphQLError("No se ha escrito nada");
            }

            if(args.fat_total_g){
                datosModificar.fat_total_g = new Double(args.fat_total_g);
            }

            if(args.sodium_mg){
                datosModificar.sodium_mg = args.sodium_mg;
            }

            if(args.potassium_mg){
                datosModificar.potassium_mg = args.potassium_mg;
            }

            if(args.carbohydrates_total_g){
                datosModificar.carbohydrates_total_g = new Double(args.carbohydrates_total_g);
            }

            if(args.fiber_g){
                datosModificar.fiber_g = new Double(args.fiber_g);
            }

            if(args.sugar_g){
                datosModificar.sugar_g = new Double(args.sugar_g);
            }

            const recetaModificada = await ctx.recetaColletion.findOneAndUpdate(
                { _id : new ObjectId(args.id) },
                { $set: { ...datosModificar } } ,  
                { returnDocument: "after" }
            );

            if(recetaModificada){
                return recetaModificada;
            }else {
                throw new GraphQLError("No se ha podido modificar la receta");
            }
        }
    } 
    
}
