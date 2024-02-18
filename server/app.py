from flask import Flask
from flask_cors import CORS
from flask import Flask, jsonify  # Import jsonify along with Flask
import psycopg2
import psycopg2.extras
from flask import request


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

db_config = {
    "host": "localhost",
    "database": "stitch_flying",
    "user": "lishaliang",
    "password": "LEE86012"
}

@app.route('/')
def hello_world():
    print ('Hello World')
    return 'Hello, World!'

@app.route('/api/data', methods=['GET'])
def get_data():
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

@app.route('/api/place-order', methods=['POST'])
def place_order():
    order_data = request.json  # Assuming the payload structure you provided earlier

    # Connect to the database
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()

    try:
        # Extract user information from the order data
        user_info = order_data.get('user', {})
        products = order_data.get('products', [])
        order_date = order_data.get('date_of_order', None)

        # Ensure all required user information is present
        required_fields = ['cardholder', 'city', 'country', 'email', 'expire-date', 'State/Province', 'postal-code', 'street-address']
        for field in required_fields:
            if field not in user_info or not user_info[field]:
                return jsonify({"error": f"Missing user information: {field}"}), 400

        # Insert or update user information
        cur.execute("""
            INSERT INTO users (cardholder, city, country, email, expire_date, state_province, post_code, street_address, card_number)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (cardholder) DO UPDATE SET
            city = EXCLUDED.city,
            country = EXCLUDED.country,
            email = EXCLUDED.email,
            expire_date = EXCLUDED.expire_date,
            state_province = EXCLUDED.state_province,
            post_code = EXCLUDED.post_code,
            street_address = EXCLUDED.street_address,
            card_number = EXCLUDED.card_number
            RETURNING id;
        """, (
            user_info['cardholder'], user_info['city'], user_info['country'],
            user_info['email'], user_info['expire-date'], user_info['State/Province'],
            user_info['postal-code'], user_info['street-address'], user_info['card-number']
        ))

        user_id = cur.fetchone()[0]

        # Insert a new order for the user
        cur.execute("INSERT INTO orders (user_id, date_of_order) VALUES (%s, %s) RETURNING id;", (user_id, order_date))
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

        # Return a success response
        return jsonify({"message": "Order placed successfully"}), 201

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Database error: {error}")
        conn.rollback()  # Rollback the transaction on error
        return jsonify({"error": str(error)}), 500

    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()





if __name__ == '__main__':
    app.run(debug=True)