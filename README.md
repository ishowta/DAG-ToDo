[Site](https://todo.temp-iwata.tokyo/)

It is a simple ToDo with dependency expressed by DAG

![screenshot](./screenshot2.png)

### How to use
1. Add some ToDo's.
2. Add dependence arrows by dragging with shift-key from ToDo to ToDo (Remove an arrow by click it).
3. Let's start with Blue ToDo's!

### Tasks
- Add test
- Improve UI/UX

### How to run
1. client
   - `yarn`
   - Copy `.env.sample` to `.env` and fill it
   - `yarn start`
2. server
   - `pipenv --python 3`
   - `pipenv install`
   - `pipenv shell`
   - `python3 server.py`
   - `redis-server --port 3002`
