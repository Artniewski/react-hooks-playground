import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');

    const submitHandler = event => {
        event.preventDefault();
        props.onAddIngredient({title: currentTitle, amount: currentAmount});
    };

    return (
        <section className="ingredient-form">
            <Card>
                <form onSubmit={submitHandler}>
                    <div className="form-control">
                        <label htmlFor="title">Name</label>
                        <input type="text" id="title" value={currentTitle}
                               onChange={event => setCurrentTitle(event.target.value)}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="amount">Amount</label>
                        <input type="number" id="amount" value={currentAmount}
                               onChange={event => setCurrentAmount(event.target.value)}/>
                    </div>
                    <div className="ingredient-form__actions">
                        <button type="submit">Add Ingredient</button>
                    </div>
                </form>
            </Card>
        </section>
    );
});

export default IngredientForm;
