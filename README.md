

# **BullTracker** - Cryptocurrency portfolio tracker
#### Data from [CoinGecko][coincgeko] API <img src="https://static.coingecko.com/s/coingecko-logo-white-3f2aeb48e13428b7199395259dbb96280bf47ea05b2940ef7d3e87c61e4d8408.png" alt="alt text" width="30px">


### Features
- Insert your cryptocurrency holdings.
- Track each individual cryptocurrency .
- Track your total portfolio value in various currencies.
- Lightweight and user friendly UI.
- Fully client-side.

### Check it out
- [BullTracker][bullTracker-Link]
- [BullTracker Demo][bullTrackerDemo-Link]

### How it works
The app consists of 2 parts
- **The Client** 
Is responsible for retrieving the data, formating them and extracting the usefull information like
total portfolio value , percetance changes etc.
When the app is loaded, for each portfolio coin, an API call happens asynchronously that retrieves the historic data.
When all API calls are complete, then the data get combined,modified and finally are passed to the second part of the app.
- **The UI** 
Is responsible for displaying the user-friendly data that receives from the Client.
Also has the functionality of saving and editing the user data (coins, holdings, currency, etc) using the local storage.

   [bullTracker-Link]: <https://github.com/joemccann/dillinger>
   [bullTrackerDemo-Link]: <https://github.com/joemccann/dillinger.git>
   [coincgeko]: <https://www.coingecko.com/en>