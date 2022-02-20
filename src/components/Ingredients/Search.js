import React, {useEffect, useRef, useState} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
    const [enteredFilter, setEnteredFilter] = useState('');
    const {onLoadIngredients} = props;
    const inputRef = useRef(null);

    useEffect(() => {
            const timer = setTimeout(() => {
                if (enteredFilter === inputRef.current.value) {
                    async function fetchData() {
                        const query =
                            enteredFilter.length === 0
                                ? ''
                                : `?orderBy="title"&equalTo="${enteredFilter}"`
                        const response = await fetch('https://react-hooks-36e3d-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query);
                        const responseData = await response.json();
                        const loadedIngredients = [];
                        for (const key in responseData) {
                            loadedIngredients.push({id: key, ...responseData[key]});
                        }
                        onLoadIngredients(loadedIngredients);
                    }

                    fetchData();
                }
            }, 500);

            return () => {
                clearTimeout(timer);
            }
        },
        [enteredFilter, onLoadIngredients])

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        ref={inputRef}
                        type="text" value={enteredFilter}
                        onChange={event => setEnteredFilter(event.target.value)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;
