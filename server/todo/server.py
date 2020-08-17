import pickledb
import base64
import atexit
from flask import request, Flask
app = Flask(__name__)

db_dagtodo = pickledb.load("dagtodo.db", True)

def dumpAllDB():
        db_dagtodo.dump()

# atexit.register(dumpAllDB)

@app.route('/<string:room_name>', methods=["GET","POST"])
def dagtodo(room_name):
        db = db_dagtodo
        key = room_name
        if request.method == "GET":
                data = db.get(key)
                if data == False: return ""
                data = base64.b64decode(data.encode())
                return data
        if request.method == "POST":
                data = request.get_data()
                print(data)
                data = base64.b64encode(data).decode("utf-8")
                db.set(key, data)
                return ""

if __name__ == "__main__":
        app.run(host='0.0.0.0', port='3001')
