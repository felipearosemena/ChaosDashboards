# Chaos Dashboards

Public url at: https://chaos-dashboards.vercel.app/

## Architecture

<img src="https://user-images.githubusercontent.com/6720312/195651293-f5c4bdb5-827f-4651-b82c-a9a113dbea75.png" width="720" />

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
Most of the API is driven via graphql. Visit `/api/graphql` in the browser to access the Yoga playground.

Any Query or Mutation that interacts with a `Dashboard` or it's `CryptoPair`s reads and writes from a MongoDB instance.

Credentials are saved to `.env.local.sample` for ease of share with the tester. In production we're remove the credentials from the file.

The `coinInfo` Query hits the coingecko api directly.

> This coingecko api is rate limited to 10 requests each 60 seconds, and while i was tested i noticed it can be fickle. If you see an error loading coins, reload or try again in a few seconds

### `/api/prices`
Gets prices directly from coingecko. 

> TODO: Move this endpoint to a graphql query as well

## Improvements

- [x] Graphql + Codegen
- [x] Autocomplete For Pairs
- [x] Server side storage
- [x] Initial coin data fetching error handling
- [x] Disable selected pairs in dashboard
- [ ] Tests
- [ ] Auth & Dashboards per user
- [ ] Better search UX: search by coin name to filter out symbol options
- [ ] Responsive styles
- [ ] Graceful widget + image loading