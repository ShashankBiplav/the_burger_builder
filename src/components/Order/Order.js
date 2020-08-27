import React from 'react';

import classes from './Order.module.css';

const order = (props) => (
    <div className={classes.Order}>
        <p>Ingredients: Salad(1) Meat(2) Bacon(1) Cheese(2)</p>
        <p>Price: <strong>₹ 180</strong></p>
    </div>
);

export default order;