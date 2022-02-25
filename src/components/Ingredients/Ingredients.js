import React, {useCallback, useReducer, useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(ingredient => ingredient.id !== action.id);
        default:
            throw new Error('Wrong action type');
    }
}

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...currentHttpState, loading: false}
        case 'ERROR':
            return {loading: false, error: action.error}
        case 'CLEAR':
            return {...currentHttpState, error: null}
        default:
            throw new Error();
    }
}

function Ingredients() {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    //const [userIngredients, setUserIngredients] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        //setUserIngredients(filteredIngredients)
        dispatch({type: 'SET', ingredients: filteredIngredients});
    }, []);

    const addIngredientHandler = async ingredient => {
        // setIsLoading(true);
        dispatchHttp({type: 'SEND'});
        try {
            const response = await fetch(
                'https://react-hooks-36e3d-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
                {
                    method: 'POST',
                    body: JSON.stringify(ingredient),
                    headers: {'Content-Type': 'application/json'}
                });
            const responseData = await response.json();
            // setIsLoading(false);
            // setUserIngredients(prevIngredients => [
            //     ...prevIngredients,
            //     {id: responseData.name, ...ingredient}
            // ]);
            dispatchHttp({type: 'RESPONSE'})
            dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
        } catch (error) {
            // setError('Something went wrong');
            // setIsLoading(false);
            dispatchHttp({type: 'ERROR', error: error.message});
        }
    };

    const removeIngredientHandler = async ingredientId => {
        //setIsLoading(true);
        dispatchHttp({type: 'SEND'});
        try {
            await fetch(
                `https://react-hooks-36e3d-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
                {
                    method: 'DELETE',
                });
            // setIsLoading(false);
            // setUserIngredients(prevIngredients => {
            //     return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
            // })
            dispatchHttp({type: 'RESPONSE'})
            dispatch({type: 'DELETE', id: ingredientId});
        } catch (error) {
            // setError('Something went wrong');
            // setIsLoading(false);
            dispatchHttp({type: 'ERROR', error: error.message});

        }
    }

    const clearError = () => {
        // setError(null);
        dispatchHttp({type: 'CLEAR'})
    }

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
