# E-commerce Cart and Coupon Service

A clean, scalable, and modular Node.js backend for an e-commerce cart and coupon system.

## Features
- **Cart Operations**: Add, update, remove items with real-time total calculation.
- **Coupon System**: 
    - Manual coupons (Fixed/Percentage).
    - Auto-applied coupons based on rules.
    - Complex validation (min amount, min items, product restrictions, usage limits).
- **Architecture**: Modular, Vertical Slice architecture with centralized entity management.
- **Database**: PostgreSQL with Sequelize ORM (Snake case columns).

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    - Rename `.env.example` to `.env`.
    - Update `DATABASE_URL` with your PostgreSQL connection string.
    ```env
    DATABASE_URL=postgres://user:password@host:5432/dbname
    ```

3.  **Database Migration**
    - Run the sync script to create tables (WARNING: Drops existing tables).
    ```bash
    npm run db:sync
    ```

4.  **Start Server**
    ```bash
    npm run dev
    ```

## API Documentation (For Postman Testing)

### 1. Products

**Create Product**
- **URL**: `POST /api/v1/products`
- **Body**:
  ```json
  {
    "name": "Gaming Laptop",
    "price": 1200.00,
    "stock": 10
  }
  ```

**Get All Products**
- **URL**: `GET /api/v1/products`

### 2. Coupons

**Create General Coupon**
- **URL**: `POST /api/v1/coupons`
- **Body**:
  ```json
  {
    "code": "SAVE10",
    "type": "general",
    "discount_type": "percentage",
    "discount_value": 10,
    "start_date": "2024-01-01",
    "expiry_date": "2025-12-31",
    "usage_limit": 100,
    "user_usage_limit": 1
  }
  ```

**Create Auto-Applied Coupon (e.g., $50 off if total > $500)**
- **URL**: `POST /api/v1/coupons`
- **Body**:
  ```json
  {
    "code": "AUTO50",
    "type": "auto_applied",
    "discount_type": "fixed",
    "discount_value": 50,
    "start_date": "2024-01-01",
    "expiry_date": "2025-12-31",
    "rules": [
      {
        "rule_type": "min_cart_amount",
        "value": { "amount": 500 }
      }
    ]
  }
  ```

### 3. Cart

**Add Item to Cart**
- **URL**: `POST /api/v1/cart/items`
- **Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "productId": "PRODUCT_UUID_FROM_STEP_1",
    "quantity": 1
  }
  ```

**Get Cart**
- **URL**: `GET /api/v1/cart?userId=123e4567-e89b-12d3-a456-426614174000`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "cartId": "...",
      "items": [...],
      "coupon": null,
      "summary": {
        "subtotal": 1200,
        "discount": 0,
        "total": 1200
      }
    }
  }
  ```

**Apply Coupon**
- **URL**: `POST /api/v1/cart/coupon`
- **Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "code": "SAVE10"
  }
  ```

**Remove Coupon**
- **URL**: `DELETE /api/v1/cart/coupon`
- **Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
  ```

**Update Item Quantity**
- **URL**: `PUT /api/v1/cart/items/ITEM_UUID`
- **Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "quantity": 2
  }
  ```

**Remove Item**
- **URL**: `DELETE /api/v1/cart/items/ITEM_UUID`
- **Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
  ```

## Testing Flow
1. Create a Product. Copy its ID.
2. Add item to cart using a random UUID for `userId`.
3. Check `GET /cart`.
4. Create a Coupon (`SAVE10`).
5. Apply Coupon. Check `GET /cart` to see discount.
6. Create an Auto-Applied Coupon (`AUTO50` for > $500).
7. Add more items to reach $500. Check `GET /cart` to see if `AUTO50` is applied (if no manual coupon is set).