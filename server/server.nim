import base64, strformat
import jester, redis

proc connectRedis(): Future[AsyncRedis]{.async.} =
    return await openAsync("localhost", 6379.Port)

proc main() {.async.} =
    let r = await connectRedis()

    router todoRouter:
        get "/@room_name":
            let room_name = @"room_name"
            request.sendHeaders(Http200, @{
                "Content-Type": "text/event-stream",
                "Access-Control-Allow-Origin": "*",
                "X-Accel-Buffering": "no"
            })

            # Get Todo
            let todo = await r.get(room_name)
            if todo != redisNil:
                let raw_todo = decode todo
                request.send(fmt"data: {raw_todo}" & "\n\n")

            # Subscribe Todo
            let sub = await connectRedis()
            await sub.subscribe(room_name)
            while true:
                let todo = (await sub.nextMessage()).message
                let raw_todo = decode todo
                request.send(fmt"data: {raw_todo}" & "\n\n")

        post "/@room_name":
            let raw_todo = request.body()
            let todo = encode raw_todo
            discard r.setk(@"room_name", todo)
            discard r.publish(@"room_name", todo)
            resp Http200, {"Access-Control-Allow-Origin": "*"}, "ok"

    var jester = initJester(
        matcher = todoRouter,
        settings = newSettings(
            port = 3001.Port,
            bindAddr = "0.0.0.0"
        )
    )
    jester.serve()

waitFor main()
