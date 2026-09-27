
from flask import Flask, request, jsonify
import math
import csv
import os
from datetime import datetime

app = Flask(__name__)


def save_history(num1, num2, operation, result):
    file_exists = os.path.isfile("history.csv")

    with open("history.csv", "a", newline="") as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "timestamp",
                "num1",
                "num2",
                "operation",
                "result"
            ])

        writer.writerow([
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            num1,
            num2,
            operation,
            result
        ])


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()

    num1 = data.get('num1', 0)
    num2 = data.get('num2', 0)
    operation = data.get('operation', 'add')

    if operation == 'add':
        result = num1 + num2

    elif operation == 'subtract':
        result = num1 - num2

    elif operation == 'multiply':
        result = num1 * num2

    elif operation == 'divide':
        result = num1 / num2 if num2 != 0 else "Error: Division by zero"

    elif operation == 'modulo':
        result = num1 % num2 if num2 != 0 else "Error: Division by zero"

    elif operation == 'power':
        result = num1 ** num2

    elif operation == 'square_root':
        result = math.sqrt(num1) if num1 >= 0 else "Error: Cannot calculate square root of a negative number"

    else:
        result = "Invalid operation"

    save_history(num1, num2, operation, result)

    return jsonify({
        'status': 'success',
        'input': data,
        'result': result,
        'message': 'Python processed your request!'
    })


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({
        'status': 'Python is running!'
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)