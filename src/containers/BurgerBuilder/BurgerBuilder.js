import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 20,
    cheese: 20,
    meat: 40,
    bacon: 30
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 30,
        purchaseable: false,
        purchaseMode: false,
        loading: false
    };

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, elemnt) => {
                return sum + elemnt;
            }, 0); //0 is the starting element
        this.setState({purchaseable: sum > 0});
    };

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    };
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    };
    purchaseModeHandler = () => {
        this.setState({purchaseMode: true});
    };
    purchaseCancelHandler = () => {
        this.setState({purchaseMode: false});
    };
    purchaseContinueHandler = () => {
        // alert('Continue to checkout');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Shashank Biplav',
                address: {
                    street: 'Test Street 1',
                    zipcode: '812001',
                    country: 'India'
                },
                email: 'shashankbiplav@gmail.com'
            },
            deliveryMethod: 'fastest'
        };
        axios.post('/orders.json', order)
            .then(res => {
                console.log(res);
                this.setState({loading: false, purchaseMode: false});
            })
            .catch(err => {
                console.log(err);
                this.setState({loading: false, purchaseMode: false});
            });
    };

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = <OrderSummary ingredients={this.state.ingredients}
                                         price={this.state.totalPrice}
                                         purchaseCanceled={this.purchaseCancelHandler}
                                         purchaseContinued={this.purchaseContinueHandler}/>;
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchaseMode} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls ingredientAdded={this.addIngredientHandler}
                               ingredientRemoved={this.removeIngredientHandler}
                               disabled={disabledInfo}
                               purchaseable={this.state.purchaseable}
                               price={this.state.totalPrice}
                               ordered={this.purchaseModeHandler}
                />
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);