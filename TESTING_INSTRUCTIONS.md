# Testing Instructions for Cart and Coupon Feature

This document provides instructions on how to install, run, and manually test the Cart and Coupon features.

## 1. Installation

1.  Open your terminal in the project directory.
2.  Install the dependencies:
    ```bash
    npm install
    ```

## 2. Configuration

1.  Create a `.env` file in the root directory (if it doesn't exist).
2.  Add your Database URL (get this from your email as per instructions) and Port:
    ```env
    DATABASE_URL=postgres://user:password@host:port/database_name
    PORT=3000
    NODE_ENV=development
    ```

## 3. Running the Server

Start the server using the command:
```bash
npm start
```
The server should start on `http://localhost:3000` (or your configured PORT).

---

## 4. Requirement Test Case Instructions (Manual Testing)

You can verify the requirements using a tool like **Postman**, **Insomnia**, or **cURL**.

**Base URL:** `http://localhost:3000`
**Test User ID:** `123e4567-e89b-12d3-a456-426614174000` (You can use any UUID)

### A. Setup Data (If not already seeded)

**1. Create a Product**
*   **Endpoint:** `POST /products`
*   **Body:**
    ```json
    {
      "name": "Test Product",
      "price": 100,
      "stock": 50
    }
    ```
*   **Response:** Note the `id` of the created product (e.g., `product_id_1`).

**2. Create a General Coupon (Manual)**
*   **Endpoint:** `POST /coupons`
*   **Body:**
    ```json
    {
      "code": "SAVE10",
      "type": "general",
      "discount_type": "fixed",
      "discount_value": 10,
      "start_date": "2024-01-01",
      "expiry_date": "2025-12-31",
      "usage_limit": 100
    }
    ```

**3. Create an Auto-Applied Coupon**
*   **Endpoint:** `POST /coupons`
*   **Body:**
    ```json
    {
      "code": "AUTO5",
      "type": "auto_applied",
      "discount_type": "percentage",
      "discount_value": 5,
      "start_date": "2024-01-01",
      "expiry_date": "2025-12-31",
      "rules": [
        {
          "rule_type": "min_cart_amount",
          "value": { "amount": 200 }
        }
      ]
    }
    ```

---

### B. Cart Requirements Testing

**1. Add Item to Cart**
*   **Requirement:** "A customer can add items to the cart."
*   **Endpoint:** `POST /cart/items`
*   **Body:**
    ```json
    {
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "productId": "<product_id_1>",
      "quantity": 1
    }
    ```
*   **Verify:** Response should show the item added and the subtotal (e.g., 100).

**2. Update Item in Cart**
*   **Requirement:** "A customer can update... items from the cart."
*   **Endpoint:** `PUT /cart/items/<cart_item_id>` (Get `cart_item_id` from the previous response `items -> id`)
*   **Body:**
    ```json
    {
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "quantity": 2
    }
    ```
*   **Verify:** Quantity updates to 2, subtotal updates (e.g., 200).

**3. Remove Item from Cart**
*   **Requirement:** "A customer can... remove items from the cart."
*   **Endpoint:** `DELETE /cart/items/<cart_item_id>`
*   **Body:**
    ```json
    {
      "userId": "123e4567-e89b-12d3-a456-426614174000"
    }
    ```
*   **Verify:** Item is removed from the list.

---

### C. Coupon Requirements Testing

**1. Apply Manual Coupon**
*   **Requirement:** "The customer manually enters the coupon code. If valid, the discount is applied."
*   **Endpoint:** `POST /cart/coupon`
*   **Body:**
    ```json
    {
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "code": "SAVE10"
    }
    ```
*   **Verify:**
    *   `coupon` object is present in response.
    *   `summary.discount` shows `10`.
    *   `summary.total` shows `subtotal - 10`.

**2. Auto-Applied Coupon**
*   **Requirement:** "This coupon should be applied automatically."
*   **Test:**
    *   Remove the manual coupon first: `DELETE /cart/coupon` (Body: `{ "userId": "..." }`).
    *   Ensure your cart total meets the auto-coupon criteria (e.g., > 200).
    *   Call `GET /cart?userId=123e4567-e89b-12d3-a456-426614174000`.
*   **Verify:**
    *   The response should automatically include the `AUTO5` coupon (if criteria met).
    *   `summary.discount` should reflect 5% of subtotal.

**3. Coupon Rules Validation**
*   **Requirement:** "Minimum total price required."
*   **Test:**
    *   Create a coupon with high min price.
    *   Try to apply it to a small cart.
*   **Verify:** API should return `400 Bad Request` with message "Minimum cart amount... required".

---

### D. Checkout

**1. Checkout**
*   **Endpoint:** `POST /cart/checkout`
*   **Body:**
    ```json
    {
      "userId": "123e4567-e89b-12d3-a456-426614174000"
    }
    ```
*   **Verify:**
    *   Response: "Checkout successful".
    *   Cart status becomes `completed`.
    *   Coupon usage count increments (if checked in DB).
