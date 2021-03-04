# pregnancy-centre

### Secret Manager
Run the following commands from the repo root:

To populate local environment files with secrets from secret manager:
`vault kv get -format=json kv/pregnancy-centre | python update_secret_files.py`

To update the secrets inside secret manager using local environment files:
`vault kv put kv/pregnancy-centre CLIENT_ENV_VARS=@client/.env SERVER_ENV_VARS=@server/.env`

Helpful secret manager setup guide:
https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e#3008f54889ab4b0cacfa276cbc43e613

~ For Windows users ~
- Having python 3 is a prerequisite, but you might have to use `python` instead of `python3` (this will depend on the user/OS)
- For Windows 10 users, make sure to run cmd/powershell as admin
- Running with Git Bash also works

### Deployment


#### Client
Tutorial: https://developer.okta.com/blog/2020/06/24/heroku-docker-react

1. go to heroku dashboard
2. go to the app (frozen-sands-75094) 
3. enable the `web` dyno


Go to `/client`. Then run:
```
heroku container:push web -a frozen-sands-75094
heroku container:release web -a frozen-sands-75094
```

Check logs:
```
heroku logs --tail -a frozen-sands-75094
```

### Server
Tutorials: 
+ https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
+ https://medium.com/@VincentSchoener/development-with-docker-and-typescript-75956e1af4ca
+ https://medium.com/@VincentSchoener/development-of-nodejs-application-with-docker-and-typescript-part-2-4dd51c1e7766


Go to `/server`. Then run:
```
heroku container:push tpc-server -a frozen-sands-75094
heroku container:release tpc-server -a frozen-sands-75094
```

Give static IPs to dyno. Provision [QuotaguardStatic](https://devcenter.heroku.com/articles/quotaguardstatic#:~:text=QuotaGuard%20Static%20is%20a%20Heroku,firewall%20to%20access%20internal%20resources.) add on for Heroku.
```
heroku addons:create quotaguardstatic:starter
heroku config:get QUOTAGUARDSTATIC_URL
```
+ Add static IPs to MongoDB Atlas network whitelist

Funnel requests to MongoDB Atlas through SOCKS proxy.
+ Stackoverflow: https://stackoverflow.com/a/64535160
+ Remove `+srv` from `MONGODB_URL` in `.env`
  + `MONGO_URI='mongodb://dev:<password>@cluster0.gwbcg.mongodb.net/dev?retryWrites=true&w=majority'`
+ Two tutorials (possibly duplicates)
  + https://support.quotaguard.com/support/solutions/articles/12000066411-how-to-connect-to-mongodb-using-quotaguard
  + https://devcenter.heroku.com/articles/quotaguardstatic#socks5-proxy-with-qgtunnel
+ MongoDB server is located at `cluster0.gwbcg.mongodb.net`
+ Go to QuotaGuard admin dashboard
  + Go to set up
  + Create a new tunnel with the following fields:
    + Remote dest: `tcp://cluster0.gwbcg.mongodb.net:27017` (use domain of MongoDB server)
    + Local port: `27017`
    + Transparent: true
    + Encrypted: false (mongodb protocol is usually already encrypted)


