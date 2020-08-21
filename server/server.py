import base64
import redis
from flask import request, Flask, Response
app = Flask(__name__)

r = redis.Redis(host='localhost', port=3002, db=0)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

def event_stream(key):
        data = r.get(key)
        if(data != None):
                yield 'data: %s\n\n' % base64.b64decode(data).decode('utf-8')
        ps = r.pubsub()
        ps.subscribe(key)
        for message in ps.listen():
                if(message['type'] == 'message'):
                        data = message['data']
                        data = base64.b64decode(data).decode('utf-8')
                        yield 'data: %s\n\n' % data

@app.route('/<string:room_name>', methods=["GET","POST"])
def dagtodo(room_name):
        key = room_name
        if request.method == "GET":
                res = Response(event_stream(key), mimetype="text/event-stream")
                res.headers['X-Accel-Buffering'] = 'no'
                return res
        if request.method == "POST":
                data = request.get_data()
                data = base64.b64encode(data).decode("utf-8")
                r.set(key, data)
                r.publish(key, data)
                return ""

if __name__ == "__main__":
        app.run(host='0.0.0.0', port='3001')
