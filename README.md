# Chaos Dashboards

Public url at: https://chaos-dashboards.vercel.app/

> The coingecko api is rate limited to 10 requests each 60 seconds.
> If you get an error loading tokens, reload the browser or try again in a few seconds
## Architecture

<img src="https://user-images.githubusercontent.com/6720312/195718224-4b5166d2-27c6-4628-ba3a-5c25132f15d9.png" width="720" />

## Install and start the server

- `mv .env.local.sample .env.local`
- `yarn && yarn build && yarn start`

Once the server starts, visit: `http://localhost:3000`

> Requires node >=16: `nvm use 16`
## Pages

- Dashboards -> `/`
- Dashboard by ID -> `/dashboard/:id`
- New Dashboard -> `/new`

## API

### `/api/graphql`
All the API is driven via graphql. Visit `/api/graphql` in the browser to access the Yoga playground.

Any Query or Mutation that interacts with a `Dashboard` or it's `CryptoPair`s reads and writes from a MongoDB instance.

Credentials are saved to `.env.local.sample` for ease of share with the tester.

`coinInfo` & `prices` Queries hit the coingecko api directly. They cannot be abused or we'll hit the rate limit for the free tier.
