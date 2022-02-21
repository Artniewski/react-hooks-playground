import React, {useCallback, useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

function Ingredients() {
    const [userIngredients, setUserIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients)
    }, []);

    const addIngredientHandler = async ingredient => {
        setIsLoading(true);
        const response = await fetch(
            'https://react-hooks-36e3d-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
            {
                method: 'POST',
                body: JSON.stringify(ingredient),
                headers: {'Content-Type': 'application/json'}
            });
        const responseData = await response.json();
        setIsLoading(false);
        setUserIngredients(prevIngredients => [
            ...prevIngredients,
            {id: responseData.name, ...ingredient}
        ]);
    };

    const removeIngredientHandler = async ingredientId => {
        setIsLoading(true);
        try {
            await fetch(
                `https://react-hooks-36e3d-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
                {
                    method: 'DELETE',
                });
            setIsLoading(false);
            setUserIngredients(prevIngredients => {
                return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
            })
        } catch (error) {
            setError('Something went wrong');
            setIsLoading(false);
        }
    }

    const clearError = () => {
        setError();
    }

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
