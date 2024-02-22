from flask import Flask
from flask_cors import CORS
from flask import Flask, jsonify  # Import jsonify along with Flask
from flask import request
from flask import session
from werkzeug.security import check_password_hash
import psycopg2
import psycopg2.extras


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": '*'}}, supports_credentials=True)
db_config = {
    "host": "localhost",
    "database": "stitch_flying",
    "user": "lishaliang",
    "password": "LEE86012"
}
app.secret_key = 'khgjjhgddfjhgjhkh'
# Session cookie configuration
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True


@app.route('/')
def hello_world():
    print('Hello World')
    return 'Hello, World!'

# get products data
@app.route('/api/data', methods=['GET'])
def get_products_data():
    conn = None
    try:
        # Connect to the database
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        # Execute a database query
        cur.execute("SELECT * FROM products")
        rows = cur.fetchall()

        # Convert query results to a list of dictionaries
        result = []
        for row in rows:
            result.append(dict(row))

        # Close the database connection
        cur.close()
        return jsonify(result)  # Convert the result to JSON and return
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return jsonify({"error": str(error)}), 500  # Return an error response
    finally:
        if conn is not None:
            conn.close()

# register account
@app.route('/api/users', methods=['POST'])
def upload_user():
    order_data = request.json
    # Connect to the database
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()

    # Extract user information from the order data
    user_name = order_data['name']
    user_email = order_data['email']
    user_password = order_data['password']

    # Check if email already exists
    cur.execute("SELECT * FROM users WHERE email = %s", (user_email,))
    if cur.fetchone() is not None:
        cur.close()
        conn.close()
        return jsonify({"error": "Email already exists"}), 409  # 409 Conflict
        # Insert user data into the database
    try:
        cur.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id",
                    (user_name, user_email, user_password))
        user_id = cur.fetchone()[0]  # Get the generated user_id
        conn.commit()  # Commit the transaction
    except Exception as e:
        conn.rollback()  # Rollback the transaction on error
        print(f"Error inserting user: {e}")
    finally:
        cur.close()
        conn.close()

    # Return a response (success message, user ID, etc.)
    return jsonify({"message": "User registered successfully"}), 201

# login account
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json['formValues']
    email = data['email']
    password = data['password']
    # Connect to your database
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        # print('uu', user['password'], password)
        if user and user['password'] == password:
            session['user_id'] = user['id']
            print('userid', session)

            # Login successful
            return jsonify({"message": "Login successful", "user": {"email": user['email'], "name": user['name']}}), 200
        else:
            # Login failed
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred"}), 500
    finally:
        cur.close()
        conn.close()

#place order
@app.route('/api/place-order', methods=['POST'])
def place_order():
    print('user_id1', session) 

    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401  # Unauthorized

    user_id = session['user_id']
    order_data = request.json

    # Connect to the database
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()

    try:
        # Extract user information from the order data
        orders = order_data.get('order', {})
        products = order_data.get('products', [])
        order_date = order_data.get('date_of_order', None)
        subtotal = order_data.get('subtotal', None)

        # Insert or update user information
        cur.execute("""
            INSERT INTO orders (user_id, cardholder, city, country, email, expire_date, state_province, post_code, street_address, card_number, date_of_order, subtotal)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
        """, (
            user_id,
            orders['cardholder'], orders['city'], orders['country'],
            orders['email'], orders['expire-date'], orders['State/Province'],
            orders['postal-code'], orders['street-address'], orders['card-number'], order_date, subtotal
        ))
        order_id = cur.fetchone()[0]

        # Handle products in the order
        for product in products:
            # Insert or update order items
            cur.execute("""
                INSERT INTO order_items (order_id, product_id, quantity)
                VALUES (%s, %s, %s)
                ON CONFLICT (order_id, product_id) DO UPDATE SET
                quantity = EXCLUDED.quantity;
            """, (order_id, product['id'], product['quantity']))

        # Commit the transaction
        conn.commit()

    except Exception as e:
        conn.rollback()  # Rollback the transaction on error
        print(f"Error inserting order: {e}")
        return {"error": str(e)}

    finally:
        cur.close()
        conn.close()

    return {"message": "Order inserted successfully", "order_id": order_id}

#get order history
@app.route('/api/order-history', methods=['GET'])
def get_order_history():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in or session expired"}), 401  # Unauthorized

    conn = None
    try:
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        query = """
        SELECT o.id AS order_id, u.name AS user_name, oi.product_id, oi.quantity,
               p.name AS product_name, p.price
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = %s
        """

        cur.execute(query, (user_id,))
        order_history = cur.fetchall()

        # Format the result as a list of dictionaries for easier JSON serialization
        result = []
        for row in order_history:
            result.append({
                "order_id": row["order_id"],
                "user_name": row["user_name"],
                "product_id": row["product_id"],
                "quantity": row["quantity"],
                "product_name": row["product_name"],
                "price": row["price"]
            })

        cur.close()
        return jsonify(result)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return jsonify({"error": str(error)}), 500
    finally:
        if conn:
            conn.close()


if __name__ == '__main__':
    app.run(debug=True)
