## Project setup
```bash
	npm install
```

## Compile to Typescript
```bash
	npm run build
```

## Run Express server
```bash
	npm start
```

## Run tests
```bash
	npm run build
	npm test
```

## Build Docker image
```bash
	docker build -t coffeeshop .
```

## Run Docker image
```bash
	docker run -p 3003:3003 coffeeshop
```

## Endpoints

| Endpoint | Type | Body | Description |
| --- | --- | --- | --- |
| `/login` | POST | { username: 'cesc', password: 's3cr3t' } | Retrieve the JWT token |
| `/users` | GET | {} | Get the list of users |
| `/users` | POST | { username: 'antoni', password: 'toni123', role: 'customer' } | Add a new user |
| `/coffees` | GET | {} | Get the list of coffees |
| `/coffees/:id` | DELETE | {} | Delete a coffee by its id |
| `/coffees` | POST | {"name":"moka","intensity":9,"price":3,"stock":50} | Add a new coffee |
| `/coffees/:id` | PUT | { name: 'arabica', intensity: 12, price: 5, stock: 28 } | Update a new coffee by its id |
| `/orders` | GET | {} | Get the list of orders |
| `/orders` | POST | { coffee: 'ristretto', quantity: 10 } | Create an order |
