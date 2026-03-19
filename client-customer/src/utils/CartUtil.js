const CartUtil = {
    getTotal: function (mycart) {
        var total = 0;
        for (const item of mycart) {
            total += item.product.price * item.quantity;
        }
        return total;
    }
};

export default CartUtil;