# Chaos Dashboards


## Install and Run

- Rename `.env.local.sample`

`yarn && yarn dev`

## Routes

- Dashboards -> `/`
- Dashboard -> `/dashboard/:id`
- Add Dashboard -> `/new`

## API

<!-- - GET  `/dashboards`
- Add new: POST `/dashboard` -->
 
<!-- - Get by id: GET  `/dashboard/[id]` -->
<!-- - Add new pair `/dashboard/[id]/pair`

- GET  `/coins`
- GET  `/prices?ids=<ids>&vs_currencies=<vs_currencies>` -->

## Improvements

- [ ] Move away from localStorage. Makes application vulnerable
- [ ] Graphql + Codegen
- [ ] Autocomplete For Pairs
- [ ] Server side storage
- [x] Initial coin data fetching error handling
- [ ] Filter out from selected pairs in dashboard
- [ ] Input sanitization for api routes
- [ ] Responsive styles
- [ ] Graceful widget + image loading