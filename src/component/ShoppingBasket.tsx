import { addItem, updateQuantity } from '../store/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const ShoppingBasket: React.FC = () => {
    const dispatch = useDispatch();
    const { products, items } = useSelector((state: RootState) => state.cart);
    const subTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalSavings = items.reduce((total, item) => total + item.savings, 0);
    const totalAmount = subTotal - totalSavings;
    return (
        <div className='container py-4'>
            <div className='row'>
                <div className="col-12 col-lg-3 bg-white p-3 rounded shadow me-lg-4">
                    <h2 className='h5 fw-bold mb-3'>Products</h2>
                    {products.map((product) => (
                        <div key={product.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <span>{product.name}</span>
                            <div className="d-flex align-items-center">
                                <span className="me-2">£{product.price.toFixed(2)}</span>
                                <button
                                    onClick={() => dispatch(addItem(product.id))}
                                    className="btn btn-success btn-sm"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>



                <div className="col-12 col-lg-8 bg-white p-3 rounded shadow">
                    <h2 className='h5 fw-bold mb-3'>Basket</h2>
                    {items.length === 0 && <p className='text-muted'>Basket is empty</p>}

                    {items.map((item) => (
                        <div key={item.id} className='mb-3 pb-3 border-bottom'>
                            <div className='d-flex justify-content-between flex-wrap align-items-center mb-2'>
                                <span className='fw-semibold'>{item.name}</span>
                                <div className="d-flex align-items-center mt-2 mt-md-0">
                                    <span>£{item.price.toFixed(2)}</span>
                                    <div className="border rounded d-flex align-items-center">
                                        <button
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                            className="btn btn-sm btn-light"
                                            disabled={item.quantity < 1}
                                        >
                                            -
                                        </button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                            className="btn btn-sm btn-light"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='text-muted small'>
                                <p>Item price £{item.price.toFixed(2)} × {item.quantity} = £{(item.price * item.quantity).toFixed(2)}</p>
                                {item.savings > 0 && <p className="text-danger">Savings £{item.savings.toFixed(2)}</p>}
                                <p>Item cost £{((item.price * item.quantity) - item.savings).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}


                    {items.length > 0 && (
                        <div className="mt-3 pt-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span>£{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Saving</span>
                                <span className='text-danger'>-£{totalSavings.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 fw-bold fs-5">
                                <span>Total Amount</span>
                                <span>£{totalAmount.toFixed(2)}</span>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShoppingBasket;