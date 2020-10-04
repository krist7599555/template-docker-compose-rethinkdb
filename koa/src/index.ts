import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import body_parser from 'koa-bodyparser';
import logger from 'koa-logger';
import { r } from 'rethinkdb-ts'

const conn = r.connectPool({
  db: 'cp44',
  server: {
    host: process.env.DB_HOST!,
    port: +process.env.DB_PORT!,
  },
})

const router = new Router()

router.get('/users', async ctx => {
  const users = await r.table('users').run()
  ctx.body = {
    meta: {
      count: users.length
    },
    data: users
  }
})
router.get('/users/:id', async ctx => {
  const user = await r.table('users').get(ctx.params.id).run()
  ctx.body = {
    data: user
  }
})
router.delete('/users/:id', async ctx => {
  const write_result = await r.table('users').get(ctx.params.id).delete().run()
  ctx.body = {
    meta: write_result
  }
})
router.post('/users', async ctx => {
  const user = ctx.request.body
  ctx.assert(user.name, 400, 'name is required')
  const write_result = await r.table('users').insert(user).run()
  ctx.body = {
    meta: write_result
  }
})

const app = new Koa();
app.use(logger());
app.use(body_parser());
app.use(cors());
app.use(router.routes())
app.use(router.allowedMethods())
app.use(async ctx => {
  ctx.body = {
    data: {
      message: "cp44 api",
      url: [
        "GET /users",
        "GET /users/:id",
        "DELETE /users/:id",
        "POST /users",
      ]
    }
  }
});

const PORT = +process.env.PORT!;
app.listen(PORT, () => {
  console.log('server listen to port:', PORT)
})