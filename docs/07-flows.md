# Main data flows

## Register

1. The user enters their account details and clicks a point on the Leaflet map. **Use my location** reads browser geolocation when allowed. The address label remains editable.
2. `src/app/register/page.tsx` sends name, email, phone, password, role, address, latitude, and longitude to `POST /api/auth/register`.
3. Zod validates fields. `bcrypt` hashes the password.
4. Prisma creates the User row. Provider signup also creates the Provider, category link, Service, PortfolioItem, and weekday Availability rows in the nested write.
5. The API signs a JWT and sets the HttpOnly cookie. JavaScript never receives the token.
6. The page routes the user to the correct dashboard. Navbar fetches `/api/auth/me` to display the server session.

## Login and logout

1. Login submits email and password to `POST /api/auth/login`.
2. The handler finds the User by normalized email and checks the bcrypt hash.
3. It signs a short-lived JWT containing the user ID and role, then returns it only as an HttpOnly cookie.
4. Logout posts to `POST /api/auth/logout`, which expires the cookie.

## Search

1. Home or search page reads filters and sends them to `GET /api/providers/search`.
2. Zod checks query values.
3. Prisma loads providers, users, categories, services, portfolio, and reviews. The server calculates geographic distance and applies radius, price, rating, category, and text filters.
4. The serializer makes JSON-safe profile objects. The page renders provider cards and map pins.

## Booking

1. A signed-in client chooses a provider, service, date, and time in `BookingModal`.
2. The browser sends provider/service IDs, appointment time, address, coordinates, and notes to `POST /api/bookings`.
3. The API gets the client ID from the verified session. It loads the selected Service and checks its provider ID.
4. It copies the current service price and type from MySQL and creates a PENDING booking with an end time based on the stored service duration.
5. `GET /api/bookings` returns only that client's bookings or that provider's bookings, based on the session role.

## Provider booking status

1. Provider clicks an action in the provider dashboard.
2. The page sends a new status to `PATCH /api/bookings/:id`.
3. The API verifies the provider owns the booking and checks the allowed status transition.
4. It updates the row and returns the booking for the screen.

## Review

1. A client selects a completed booking and submits a rating and comment.
2. The API verifies the session client owns the booking and the booking is complete.
3. It creates one Review for that booking, then recalculates the provider's rating average and count.
4. The provider page loads the updated reviews from MySQL.
