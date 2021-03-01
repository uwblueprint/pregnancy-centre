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
Tutorial: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/


