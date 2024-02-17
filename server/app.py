from flask import Flask
from flask_cors import CORS
from flask import Flask, jsonify  # Import jsonify along with Flask
import psycopg2
import psycopg2.extras


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


if __name__ == '__main__':
    app.run(debug=True)