'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productsRouter = undefined;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var debug, products, productsRouter;

debug = (0, _debug2.default)('products');

exports.productsRouter = productsRouter = new _koaRouter2.default();

products = {
  'asus-x542ba-dh99': {
    name: 'ASUS X542BA-DH99',
    price: '999.99'
  },
  'ismart-smtb4002-n14h-pro-r': {
    name: 'iSmart SMTB4002 N14H Pro-R',
    price: '1099.99'
  },
  'asus-vivobook-e403na-us21': {
    name: 'ASUS VivoBook E403NA-US21',
    price: '1299.99'
  },
  'asus-vivobook-s-s510ua-ds71': {
    name: 'ASUS Vivobook S S510UA-DS71',
    price: '899.99'
  },
  'asus-r541na-rs01-notebook': {
    name: 'ASUS R541NA-RS01 Notebook',
    price: '699.99'
  },
  'asus-zenpad-8': {
    name: 'ASUS ZenPad 8',
    price: '512.99'
  },
  'asus-transformer-book-t101ha-c4-gr': {
    name: 'ASUS Transformer Book T101HA-C4-GR',
    price: '1024.99'
  },
  'asus-zenpad-z500m-c1-sl': {
    name: 'ASUS Zenpad Z500M-C1-SL',
    price: '1280.99'
  },
  'lenovo-thinkpad-e570': {
    name: 'Lenovo ThinkPad E570',
    price: '1600.99'
  },
  'acer-refurbished-aspire-a315-21-99e5': {
    name: 'Acer (Refurbished) Aspire A315-21-99E5',
    price: '1699.99'
  },
  'asus-f542ua-dh71': {
    name: 'ASUS F542UA-DH71',
    price: '1599.99'
  },
  'acer-refurbished-swift-sf314-52-53ax': {
    name: 'Acer (Refurbished) Swift SF314-52-53AX',
    price: '1999.99'
  },
  'asus-transformer-mini-t102ha-d4-gr': {
    name: 'ASUS Transformer Mini T102HA-D4-GR',
    price: '2999.99'
  },
  'lenovo-thinkpad-t440': {
    name: 'Lenovo Thinkpad T440',
    price: '3999.99'
  },
  'asus-vivobook-x540ua-dh31': {
    name: 'ASUS VivoBook X540UA-DH31',
    price: '1349.99'
  },
  'hp-refurbished-210-g1': {
    name: 'HP(Refurbished) 210 G1',
    price: '1279.99'
  },
  'ismart-smtb4100': {
    name: 'iSmart SMTB4100',
    price: '1023.99'
  },
  'asus-zenbook-ux430uq-q72sp-cb': {
    name: 'ASUS ZenBook UX430UQ-Q72SP-CB',
    price: '799.99'
  },
  'acer-swift-3-sf314-52-55hl': {
    name: 'Acer Swift 3 SF314-52-55HL',
    price: '989.99'
  },
  'acer-refurbished-spin-3-sp315-51-598w': {
    name: 'Acer (Refurbished) Spin 3 SP315-51-598W',
    price: '499.99'
  }
};

productsRouter.get('products', '/', function (ctx, next) {
  return ctx.render('products/list', {
    title: 'Products',
    products: products
  }, true);
});

productsRouter.get('product-detail', '/:id', function (ctx, next) {
  var product;
  product = products[ctx.params.id];
  if (product === void 0) {
    return next();
  }
  debug(product);
  product.id = ctx.params.id;
  return ctx.render('products/detail', {
    title: product.name,
    product: product
  }, true);
});

exports.productsRouter = productsRouter;