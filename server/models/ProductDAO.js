require('../utils/MongooseUtil');
const Models = require('./Models');

const ProductDAO = {
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },

  async insert(product) {
    const mongoose = require('mongoose');
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },

  async update(product) {
    const update = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    };
    const result = await Models.Product.findByIdAndUpdate(product._id, update, { new: true }).exec();
    return result;
  },

  async delete(id) {
    const result = await Models.Product.findByIdAndDelete(id).exec();
    return result;
  },

  async selectById(id) {
    const product = await Models.Product.findById(id).exec();
    return product;
  },

  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const products = await Models.Product.find(query).sort(mysort).limit(top).exec();
    return products;
  },

  async selectTopHot(top) {
    // aggregate orders to find top-selling product ids
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
      { $sort: { sum: -1 } },
      { $limit: top }
    ]).exec();

    const products = [];
    for (const it of items) {
      const prod = await ProductDAO.selectById(it._id);
      if (prod) products.push(prod);
    }
    return products;
  },

  async selectByCatID(cid) {
    const query = { 'category._id': cid };
    const products = await Models.Product.find(query).exec();
    return products;
  },
  async selectByKeyword(keyword) {
        const query = { name: { $regex: new RegExp(keyword, "i") } };
        const products = await Models.Product.find(query).exec();
        return products;
    }
};

module.exports = ProductDAO;
