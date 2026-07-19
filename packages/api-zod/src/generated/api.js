"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMeResponse = exports.LogoutResponse = exports.LoginResponse = exports.LoginBody = exports.RegisterResponse = exports.RegisterBody = exports.registerBodyPasswordMin = exports.UpdateOrderStatusResponse = exports.UpdateOrderStatusBody = exports.UpdateOrderStatusParams = exports.GetOrderResponse = exports.GetOrderParams = exports.CreateOrderResponse = exports.CreateOrderBody = exports.ListOrdersResponse = exports.ListOrdersQueryParams = exports.listOrdersQueryLimitDefault = exports.listOrdersQueryPageDefault = exports.RemoveCartItemResponse = exports.RemoveCartItemParams = exports.UpdateCartItemResponse = exports.UpdateCartItemBody = exports.updateCartItemBodyQuantityMin = exports.UpdateCartItemParams = exports.AddCartItemResponse = exports.AddCartItemBody = exports.GetCartResponse = exports.GetStorefrontStatsResponse = exports.GetHomepageDataResponse = exports.ListCategoriesResponse = exports.ListCategoriesResponseItem = exports.DeleteProductResponse = exports.DeleteProductParams = exports.UpdateProductResponse = exports.UpdateProductBody = exports.UpdateProductParams = exports.GetProductResponse = exports.GetProductParams = exports.ListTrendingProductsResponse = exports.ListTrendingProductsResponseItem = exports.ListFeaturedProductsResponse = exports.ListFeaturedProductsResponseItem = exports.CreateProductResponse = exports.CreateProductBody = exports.ListProductsResponse = exports.ListProductsQueryParams = exports.listProductsQueryLimitDefault = exports.listProductsQueryPageDefault = exports.HealthCheckResponse = void 0;
const zod = __importStar(require("zod"));
exports.HealthCheckResponse = zod.object({
    "status": zod.string()
});
exports.listProductsQueryPageDefault = 1;
exports.listProductsQueryLimitDefault = 20;
exports.ListProductsQueryParams = zod.object({
    "page": zod.coerce.number().default(exports.listProductsQueryPageDefault),
    "limit": zod.coerce.number().default(exports.listProductsQueryLimitDefault),
    "category": zod.coerce.string().optional(),
    "search": zod.coerce.string().optional(),
    "status": zod.enum(['draft', 'published', 'archived']).optional(),
    "isPreOrder": zod.coerce.boolean().optional(),
    "sortBy": zod.enum(['price_asc', 'price_desc', 'newest', 'popular']).optional()
});
exports.ListProductsResponse = zod.object({
    "items": zod.array(zod.object({
        "id": zod.string(),
        "name": zod.string(),
        "slug": zod.string(),
        "description": zod.string().nullish(),
        "category": zod.string(),
        "brand": zod.string().nullish(),
        "basePrice": zod.number(),
        "currency": zod.string(),
        "primaryImageUrl": zod.string().nullish(),
        "images": zod.array(zod.string()).optional(),
        "status": zod.enum(['draft', 'published', 'archived']),
        "isPreOrder": zod.boolean(),
        "moq": zod.number().nullish(),
        "currentPreOrderCount": zod.number(),
        "estimatedShipDate": zod.coerce.date().nullish(),
        "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
        "createdAt": zod.coerce.date(),
        "attributes": zod.array(zod.object({
            "key": zod.string(),
            "label": zod.string(),
            "type": zod.string(),
            "value": zod.string()
        })).optional(),
        "variants": zod.array(zod.object({
            "sku": zod.string(),
            "price": zod.number(),
            "stock": zod.number(),
            "attributeValues": zod.record(zod.string(), zod.string()).optional(),
            "imageUrl": zod.string().nullish()
        })).optional()
    })),
    "total": zod.number(),
    "page": zod.number(),
    "limit": zod.number()
});
exports.CreateProductBody = zod.object({
    "name": zod.string(),
    "description": zod.string().optional(),
    "category": zod.string(),
    "brand": zod.string().optional(),
    "basePrice": zod.number(),
    "currency": zod.string(),
    "status": zod.enum(['draft', 'published', 'archived']),
    "isPreOrder": zod.boolean(),
    "moq": zod.number().optional(),
    "estimatedShipDate": zod.coerce.date().optional(),
    "primaryImageUrl": zod.string().optional(),
    "images": zod.array(zod.string()).optional(),
    "attributes": zod.array(zod.object({
        "key": zod.string(),
        "label": zod.string(),
        "type": zod.string(),
        "value": zod.string()
    })).optional()
});
exports.CreateProductResponse = zod.object({
    "id": zod.string(),
    "name": zod.string(),
    "slug": zod.string(),
    "description": zod.string().nullish(),
    "category": zod.string(),
    "brand": zod.string().nullish(),
    "basePrice": zod.number(),
    "currency": zod.string(),
    "primaryImageUrl": zod.string().nullish(),
    "images": zod.array(zod.string()).optional(),
    "status": zod.enum(['draft', 'published', 'archived']),
    "isPreOrder": zod.boolean(),
    "moq": zod.number().nullish(),
    "currentPreOrderCount": zod.number(),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
    "createdAt": zod.coerce.date(),
    "attributes": zod.array(zod.object({
        "key": zod.string(),
        "label": zod.string(),
        "type": zod.string(),
        "value": zod.string()
    })).optional(),
    "variants": zod.array(zod.object({
        "sku": zod.string(),
        "price": zod.number(),
        "stock": zod.number(),
        "attributeValues": zod.record(zod.string(), zod.string()).optional(),
        "imageUrl": zod.string().nullish()
    })).optional()
});
exports.ListFeaturedProductsResponseItem = zod.object({
    "id": zod.string(),
    "name": zod.string(),
    "slug": zod.string(),
    "description": zod.string().nullish(),
    "category": zod.string(),
    "brand": zod.string().nullish(),
    "basePrice": zod.number(),
    "currency": zod.string(),
    "primaryImageUrl": zod.string().nullish(),
    "images": zod.array(zod.string()).optional(),
    "status": zod.enum(['draft', 'published', 'archived']),
    "isPreOrder": zod.boolean(),
    "moq": zod.number().nullish(),
    "currentPreOrderCount": zod.number(),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
    "createdAt": zod.coerce.date(),
    "attributes": zod.array(zod.object({
        "key": zod.string(),
        "label": zod.string(),
        "type": zod.string(),
        "value": zod.string()
    })).optional(),
    "variants": zod.array(zod.object({
        "sku": zod.string(),
        "price": zod.number(),
        "stock": zod.number(),
        "attributeValues": zod.record(zod.string(), zod.string()).optional(),
        "imageUrl": zod.string().nullish()
    })).optional()
});
exports.ListFeaturedProductsResponse = zod.array(exports.ListFeaturedProductsResponseItem);
exports.ListTrendingProductsResponseItem = zod.object({
    "id": zod.string(),
    "name": zod.string(),
    "slug": zod.string(),
    "description": zod.string().nullish(),
    "category": zod.string(),
    "brand": zod.string().nullish(),
    "basePrice": zod.number(),
    "currency": zod.string(),
    "primaryImageUrl": zod.string().nullish(),
    "images": zod.array(zod.string()).optional(),
    "status": zod.enum(['draft', 'published', 'archived']),
    "isPreOrder": zod.boolean(),
    "moq": zod.number().nullish(),
    "currentPreOrderCount": zod.number(),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
    "createdAt": zod.coerce.date(),
    "attributes": zod.array(zod.object({
        "key": zod.string(),
        "label": zod.string(),
        "type": zod.string(),
        "value": zod.string()
    })).optional(),
    "variants": zod.array(zod.object({
        "sku": zod.string(),
        "price": zod.number(),
        "stock": zod.number(),
        "attributeValues": zod.record(zod.string(), zod.string()).optional(),
        "imageUrl": zod.string().nullish()
    })).optional()
});
exports.ListTrendingProductsResponse = zod.array(exports.ListTrendingProductsResponseItem);
exports.GetProductParams = zod.object({
    "slug": zod.coerce.string()
});
exports.GetProductResponse = zod.object({
    "id": zod.string(),
    "name": zod.string(),
    "slug": zod.string(),
    "description": zod.string().nullish(),
    "category": zod.string(),
    "brand": zod.string().nullish(),
    "basePrice": zod.number(),
    "currency": zod.string(),
    "primaryImageUrl": zod.string().nullish(),
    "images": zod.array(zod.string()).optional(),
    "status": zod.enum(['draft', 'published', 'archived']),
    "isPreOrder": zod.boolean(),
    "moq": zod.number().nullish(),
    "currentPreOrderCount": zod.number(),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
    "createdAt": zod.coerce.date(),
    "attributes": zod.array(zod.object({
        "key": zod.string(),
        "label": zod.string(),
        "type": zod.string(),
        "value": zod.string()
    })).optional(),
    "variants": zod.array(zod.object({
        "sku": zod.string(),
        "price": zod.number(),
        "stock": zod.number(),
        "attributeValues": zod.record(zod.string(), zod.string()).optional(),
        "imageUrl": zod.string().nullish()
    })).optional()
});
exports.UpdateProductParams = zod.object({
    "slug": zod.coerce.string()
});
exports.UpdateProductBody = zod.object({
    "name": zod.string().optional(),
    "description": zod.string().optional(),
    "category": zod.string().optional(),
    "brand": zod.string().optional(),
    "basePrice": zod.number().optional(),
    "status": zod.enum(['draft', 'published', 'archived']).optional(),
    "isPreOrder": zod.boolean().optional(),
    "moq": zod.number().optional(),
    "estimatedShipDate": zod.coerce.date().optional(),
    "primaryImageUrl": zod.string().optional(),
    "images": zod.array(zod.string()).optional()
});
exports.UpdateProductResponse = zod.object({
    "id": zod.string(),
    "name": zod.string(),
    "slug": zod.string(),
    "description": zod.string().nullish(),
    "category": zod.string(),
    "brand": zod.string().nullish(),
    "basePrice": zod.number(),
    "currency": zod.string(),
    "primaryImageUrl": zod.string().nullish(),
    "images": zod.array(zod.string()).optional(),
    "status": zod.enum(['draft', 'published', 'archived']),
    "isPreOrder": zod.boolean(),
    "moq": zod.number().nullish(),
    "currentPreOrderCount": zod.number(),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
    "createdAt": zod.coerce.date(),
    "attributes": zod.array(zod.object({
        "key": zod.string(),
        "label": zod.string(),
        "type": zod.string(),
        "value": zod.string()
    })).optional(),
    "variants": zod.array(zod.object({
        "sku": zod.string(),
        "price": zod.number(),
        "stock": zod.number(),
        "attributeValues": zod.record(zod.string(), zod.string()).optional(),
        "imageUrl": zod.string().nullish()
    })).optional()
});
exports.DeleteProductParams = zod.object({
    "slug": zod.coerce.string()
});
exports.DeleteProductResponse = zod.void();
exports.ListCategoriesResponseItem = zod.object({
    "id": zod.string(),
    "name": zod.string(),
    "slug": zod.string(),
    "iconUrl": zod.string().nullish(),
    "productCount": zod.number(),
    "description": zod.string().nullish()
});
exports.ListCategoriesResponse = zod.array(exports.ListCategoriesResponseItem);
exports.GetHomepageDataResponse = zod.object({
    "featuredProducts": zod.array(zod.object({
        "id": zod.string(),
        "name": zod.string(),
        "slug": zod.string(),
        "description": zod.string().nullish(),
        "category": zod.string(),
        "brand": zod.string().nullish(),
        "basePrice": zod.number(),
        "currency": zod.string(),
        "primaryImageUrl": zod.string().nullish(),
        "images": zod.array(zod.string()).optional(),
        "status": zod.enum(['draft', 'published', 'archived']),
        "isPreOrder": zod.boolean(),
        "moq": zod.number().nullish(),
        "currentPreOrderCount": zod.number(),
        "estimatedShipDate": zod.coerce.date().nullish(),
        "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
        "createdAt": zod.coerce.date(),
        "attributes": zod.array(zod.object({
            "key": zod.string(),
            "label": zod.string(),
            "type": zod.string(),
            "value": zod.string()
        })).optional(),
        "variants": zod.array(zod.object({
            "sku": zod.string(),
            "price": zod.number(),
            "stock": zod.number(),
            "attributeValues": zod.record(zod.string(), zod.string()).optional(),
            "imageUrl": zod.string().nullish()
        })).optional()
    })),
    "trendingProducts": zod.array(zod.object({
        "id": zod.string(),
        "name": zod.string(),
        "slug": zod.string(),
        "description": zod.string().nullish(),
        "category": zod.string(),
        "brand": zod.string().nullish(),
        "basePrice": zod.number(),
        "currency": zod.string(),
        "primaryImageUrl": zod.string().nullish(),
        "images": zod.array(zod.string()).optional(),
        "status": zod.enum(['draft', 'published', 'archived']),
        "isPreOrder": zod.boolean(),
        "moq": zod.number().nullish(),
        "currentPreOrderCount": zod.number(),
        "estimatedShipDate": zod.coerce.date().nullish(),
        "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
        "createdAt": zod.coerce.date(),
        "attributes": zod.array(zod.object({
            "key": zod.string(),
            "label": zod.string(),
            "type": zod.string(),
            "value": zod.string()
        })).optional(),
        "variants": zod.array(zod.object({
            "sku": zod.string(),
            "price": zod.number(),
            "stock": zod.number(),
            "attributeValues": zod.record(zod.string(), zod.string()).optional(),
            "imageUrl": zod.string().nullish()
        })).optional()
    })),
    "recentlyAdded": zod.array(zod.object({
        "id": zod.string(),
        "name": zod.string(),
        "slug": zod.string(),
        "description": zod.string().nullish(),
        "category": zod.string(),
        "brand": zod.string().nullish(),
        "basePrice": zod.number(),
        "currency": zod.string(),
        "primaryImageUrl": zod.string().nullish(),
        "images": zod.array(zod.string()).optional(),
        "status": zod.enum(['draft', 'published', 'archived']),
        "isPreOrder": zod.boolean(),
        "moq": zod.number().nullish(),
        "currentPreOrderCount": zod.number(),
        "estimatedShipDate": zod.coerce.date().nullish(),
        "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']).optional(),
        "createdAt": zod.coerce.date(),
        "attributes": zod.array(zod.object({
            "key": zod.string(),
            "label": zod.string(),
            "type": zod.string(),
            "value": zod.string()
        })).optional(),
        "variants": zod.array(zod.object({
            "sku": zod.string(),
            "price": zod.number(),
            "stock": zod.number(),
            "attributeValues": zod.record(zod.string(), zod.string()).optional(),
            "imageUrl": zod.string().nullish()
        })).optional()
    })),
    "categories": zod.array(zod.object({
        "id": zod.string(),
        "name": zod.string(),
        "slug": zod.string(),
        "iconUrl": zod.string().nullish(),
        "productCount": zod.number(),
        "description": zod.string().nullish()
    })),
    "stats": zod.object({
        "totalProducts": zod.number(),
        "totalCategories": zod.number(),
        "totalPreOrders": zod.number(),
        "publishedProducts": zod.number()
    })
});
exports.GetStorefrontStatsResponse = zod.object({
    "totalProducts": zod.number(),
    "totalCategories": zod.number(),
    "totalPreOrders": zod.number(),
    "publishedProducts": zod.number()
});
exports.GetCartResponse = zod.object({
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "productName": zod.string(),
        "slug": zod.string(),
        "unitPrice": zod.number(),
        "currency": zod.string(),
        "quantity": zod.number(),
        "imageUrl": zod.string().nullable(),
        "isPreOrder": zod.boolean().optional()
    })),
    "subtotal": zod.number(),
    "currency": zod.string(),
    "itemCount": zod.number()
});
exports.AddCartItemBody = zod.object({
    "productId": zod.string(),
    "quantity": zod.number().min(1),
    "variantSku": zod.string().optional()
});
exports.AddCartItemResponse = zod.object({
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "productName": zod.string(),
        "slug": zod.string(),
        "unitPrice": zod.number(),
        "currency": zod.string(),
        "quantity": zod.number(),
        "imageUrl": zod.string().nullable(),
        "isPreOrder": zod.boolean().optional()
    })),
    "subtotal": zod.number(),
    "currency": zod.string(),
    "itemCount": zod.number()
});
exports.UpdateCartItemParams = zod.object({
    "productId": zod.coerce.string()
});
exports.updateCartItemBodyQuantityMin = 0;
exports.UpdateCartItemBody = zod.object({
    "quantity": zod.number().min(exports.updateCartItemBodyQuantityMin)
});
exports.UpdateCartItemResponse = zod.object({
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "productName": zod.string(),
        "slug": zod.string(),
        "unitPrice": zod.number(),
        "currency": zod.string(),
        "quantity": zod.number(),
        "imageUrl": zod.string().nullable(),
        "isPreOrder": zod.boolean().optional()
    })),
    "subtotal": zod.number(),
    "currency": zod.string(),
    "itemCount": zod.number()
});
exports.RemoveCartItemParams = zod.object({
    "productId": zod.coerce.string()
});
exports.RemoveCartItemResponse = zod.object({
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "productName": zod.string(),
        "slug": zod.string(),
        "unitPrice": zod.number(),
        "currency": zod.string(),
        "quantity": zod.number(),
        "imageUrl": zod.string().nullable(),
        "isPreOrder": zod.boolean().optional()
    })),
    "subtotal": zod.number(),
    "currency": zod.string(),
    "itemCount": zod.number()
});
exports.listOrdersQueryPageDefault = 1;
exports.listOrdersQueryLimitDefault = 20;
exports.ListOrdersQueryParams = zod.object({
    "page": zod.coerce.number().default(exports.listOrdersQueryPageDefault),
    "limit": zod.coerce.number().default(exports.listOrdersQueryLimitDefault),
    "fulfillmentStatus": zod.coerce.string().optional(),
    "paymentStatus": zod.coerce.string().optional()
});
exports.ListOrdersResponse = zod.object({
    "items": zod.array(zod.object({
        "id": zod.string(),
        "orderNumber": zod.string(),
        "userId": zod.string().nullish(),
        "items": zod.array(zod.object({
            "productId": zod.string(),
            "sku": zod.string(),
            "name": zod.string(),
            "unitPrice": zod.number(),
            "currency": zod.string(),
            "quantity": zod.number(),
            "imageUrl": zod.string().nullish()
        })),
        "subtotal": zod.number(),
        "shippingFee": zod.number().optional(),
        "total": zod.number(),
        "currency": zod.string(),
        "paymentMethod": zod.enum(['stripe', 'bank_transfer']),
        "paymentStatus": zod.enum(['pending', 'paid', 'failed', 'refunded', 'awaiting_verification']),
        "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']),
        "shippingAddress": zod.object({
            "fullName": zod.string(),
            "line1": zod.string(),
            "line2": zod.string().nullish(),
            "city": zod.string(),
            "state": zod.string().nullish(),
            "postalCode": zod.string().nullish(),
            "country": zod.string(),
            "phone": zod.string().nullish()
        }),
        "estimatedShipDate": zod.coerce.date().nullish(),
        "createdAt": zod.coerce.date()
    })),
    "total": zod.number(),
    "page": zod.number(),
    "limit": zod.number()
});
exports.CreateOrderBody = zod.object({
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "quantity": zod.number().min(1),
        "variantSku": zod.string().optional()
    })),
    "paymentMethod": zod.enum(['stripe', 'bank_transfer']),
    "shippingAddress": zod.object({
        "fullName": zod.string(),
        "line1": zod.string(),
        "line2": zod.string().nullish(),
        "city": zod.string(),
        "state": zod.string().nullish(),
        "postalCode": zod.string().nullish(),
        "country": zod.string(),
        "phone": zod.string().nullish()
    })
});
exports.CreateOrderResponse = zod.object({
    "id": zod.string(),
    "orderNumber": zod.string(),
    "userId": zod.string().nullish(),
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "sku": zod.string(),
        "name": zod.string(),
        "unitPrice": zod.number(),
        "currency": zod.string(),
        "quantity": zod.number(),
        "imageUrl": zod.string().nullish()
    })),
    "subtotal": zod.number(),
    "shippingFee": zod.number().optional(),
    "total": zod.number(),
    "currency": zod.string(),
    "paymentMethod": zod.enum(['stripe', 'bank_transfer']),
    "paymentStatus": zod.enum(['pending', 'paid', 'failed', 'refunded', 'awaiting_verification']),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']),
    "shippingAddress": zod.object({
        "fullName": zod.string(),
        "line1": zod.string(),
        "line2": zod.string().nullish(),
        "city": zod.string(),
        "state": zod.string().nullish(),
        "postalCode": zod.string().nullish(),
        "country": zod.string(),
        "phone": zod.string().nullish()
    }),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "createdAt": zod.coerce.date()
});
exports.GetOrderParams = zod.object({
    "id": zod.coerce.string()
});
exports.GetOrderResponse = zod.object({
    "id": zod.string(),
    "orderNumber": zod.string(),
    "userId": zod.string().nullish(),
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "sku": zod.string(),
        "name": zod.string(),
        "unitPrice": zod.number(),
        "currency": zod.string(),
        "quantity": zod.number(),
        "imageUrl": zod.string().nullish()
    })),
    "subtotal": zod.number(),
    "shippingFee": zod.number().optional(),
    "total": zod.number(),
    "currency": zod.string(),
    "paymentMethod": zod.enum(['stripe', 'bank_transfer']),
    "paymentStatus": zod.enum(['pending', 'paid', 'failed', 'refunded', 'awaiting_verification']),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']),
    "shippingAddress": zod.object({
        "fullName": zod.string(),
        "line1": zod.string(),
        "line2": zod.string().nullish(),
        "city": zod.string(),
        "state": zod.string().nullish(),
        "postalCode": zod.string().nullish(),
        "country": zod.string(),
        "phone": zod.string().nullish()
    }),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "createdAt": zod.coerce.date()
});
exports.UpdateOrderStatusParams = zod.object({
    "id": zod.coerce.string()
});
exports.UpdateOrderStatusBody = zod.object({
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']),
    "note": zod.string().optional()
});
exports.UpdateOrderStatusResponse = zod.object({
    "id": zod.string(),
    "orderNumber": zod.string(),
    "userId": zod.string().nullish(),
    "items": zod.array(zod.object({
        "productId": zod.string(),
        "sku": zod.string(),
        "name": zod.string(),
        "unitPrice": zod.number(),
        "currency": zod.string(),
        "quantity": zod.number(),
        "imageUrl": zod.string().nullish()
    })),
    "subtotal": zod.number(),
    "shippingFee": zod.number().optional(),
    "total": zod.number(),
    "currency": zod.string(),
    "paymentMethod": zod.enum(['stripe', 'bank_transfer']),
    "paymentStatus": zod.enum(['pending', 'paid', 'failed', 'refunded', 'awaiting_verification']),
    "fulfillmentStatus": zod.enum(['pending', 'sourcing', 'shipped_from_supplier', 'in_transit', 'delivered', 'cancelled']),
    "shippingAddress": zod.object({
        "fullName": zod.string(),
        "line1": zod.string(),
        "line2": zod.string().nullish(),
        "city": zod.string(),
        "state": zod.string().nullish(),
        "postalCode": zod.string().nullish(),
        "country": zod.string(),
        "phone": zod.string().nullish()
    }),
    "estimatedShipDate": zod.coerce.date().nullish(),
    "createdAt": zod.coerce.date()
});
exports.registerBodyPasswordMin = 8;
exports.RegisterBody = zod.object({
    "email": zod.string(),
    "password": zod.string().min(exports.registerBodyPasswordMin),
    "name": zod.string().min(1)
});
exports.RegisterResponse = zod.object({
    "user": zod.object({
        "id": zod.string(),
        "email": zod.string(),
        "name": zod.string(),
        "avatarUrl": zod.string().nullish(),
        "role": zod.enum(['customer', 'admin', 'superadmin']),
        "createdAt": zod.coerce.date()
    }),
    "token": zod.string()
});
exports.LoginBody = zod.object({
    "email": zod.string(),
    "password": zod.string()
});
exports.LoginResponse = zod.object({
    "user": zod.object({
        "id": zod.string(),
        "email": zod.string(),
        "name": zod.string(),
        "avatarUrl": zod.string().nullish(),
        "role": zod.enum(['customer', 'admin', 'superadmin']),
        "createdAt": zod.coerce.date()
    }),
    "token": zod.string()
});
exports.LogoutResponse = zod.void();
exports.GetMeResponse = zod.object({
    "id": zod.string(),
    "email": zod.string(),
    "name": zod.string(),
    "avatarUrl": zod.string().nullish(),
    "role": zod.enum(['customer', 'admin', 'superadmin']),
    "createdAt": zod.coerce.date()
});
//# sourceMappingURL=api.js.map