import React, {useCallback, useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

function Ingredients() {
    const [userIngredients, setUserIngredients] = useState([]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients)
    }, []);

    const addIngredientHandler = async ingredient => {
        const response = await fetch(
            'https://react-hooks-36e3d-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
            {
                method: 'POST',
                body: JSON.stringify(ingredient),
                headers: {'Content-Type': 'application/json'}
            });
        const responseData = await response.json();

        setUserIngredients(prevIngredients => [
            ...prevIngredients,
            {id: responseData.name, ...ingredient}
        ]);
    };

    const removeIngredientHandler = ingredientId => {
        setUserIngredients(prevIngredients => {
            return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
        })
    }
    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
}

export default Ingredients;
