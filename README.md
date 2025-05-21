
# Crave - Food Solutions

Crave is a smart food ordering application designed to streamline and enhance the campus dining experience. It allows students and staff to pre-order meals, choose between dine-in or takeaway, and pay online, significantly reducing queue times and delays during peak hours. Each vendor has a unique interface to manage orders, and the app supports seamless UPI payments directed to individual food court stalls. With real-time updates and an intuitive interface, FoodCourt optimizes efficiency and convenience across multiple campus locations.


## Acknowledgements

 - [React Expo Docs](https://docs.expo.dev/)
 - [Supabase Docs](https://supabase.com/docs)
 - [Razorpay Docs](https://razorpay.com/docs/#home-payments)


## API Reference

#### Create order

```http
  GET /api/cart
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `amount` | `number` | **Required**. Amount in paise
| `currency`| `string` |Optional. Default is "INR"|
| `Receipt` | `string` | **Required**. Unique receipt ID|
| `Notes`    | `object `| Optional. Additional order metadata|



#### Get Cart item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user_id`      | `string` | **Required**. Supabase User ID|
|`api_key` | `string` |  **Required**. Supabase API Key |


### Upload Cart Items
```http
  POST /api/cart
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user_id`      | `string` | **Required**. User ID of the user|
|`item_id` | `string` |  **Required**. Item ID of the item |
| `quantity` | `number` | Optional. Defaults to 1|




## Features
- Pre-order meals from campus food stalls
- Dine-in or takeaway option selection
- Real-time order tracking
- UPI payment integration (stall-specific payments)
- Digital cart management
- Order history and re-order option
- Multi-campus vendor support
- Vendor dashboard for managing orders
- Live order status updates for users and vendors
- User authentication and session management
- Cross-platform compatibility (Web & Mobile)
- Responsive, user-friendly UI
- Secure API and database integration (via Supabase)
## 🚀 About Me
I’m a B.Tech CSE student passionate about solving real-world problems through technology. With a strong foundation in full-stack development, I enjoy building apps that make everyday experiences smoother and more efficient. I recently co-developed FoodCourt, a campus-based food ordering app designed to reduce queues and delays by enabling students to pre-order meals, choose dine-in or takeaway, and pay directly via UPI.

I specialize in frontend development using React and React Native (Expo), and collaborate effectively on backend systems, working with tools like Supabase. I’m always eager to learn new technologies and take on projects that blend innovation with impact.

## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/akshat-saxena-5513a8258?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BCR7%2Fv9Q%2BTvKJSXugG5ZSnQ%3D%3D)



## 🛠 Skills
React, React Expo, Supabase, Payment Gateway Integration, Canva, Figma(basic), Jira, Excel, Google Analytics 

## Screenshots

![App Screenshot](https://drive.google.com/file/d/1fCDfXOM0_coDz7pdVs-MuXi9p-AYUgsq/view?usp=drivesdk)


## Tech Stack

**Client:** React Expo, Redux

**Server:** Supabase


## Lessons Learned

While building Crave, I learned how to structure and manage a full-stack application in a collaborative environment. On the frontend, I deepened my understanding of React Native (Expo) for building responsive UIs and handling navigation and state. I also gained hands-on experience with Supabase, especially in setting up and querying databases, managing user sessions, and implementing role-based access. Integrating UPI payments through Razorpay taught me how to handle real-world payment workflows securely and efficiently.

Working in a team taught me the importance of code modularity, clear communication, and version control (Git) when working on interconnected features.

### Challenges Faced & How I Overcame Them:

- Backend Knowledge Gap:
Initially, my partner and I were both new to backend development, which slowed down the early stages. We overcame this by dividing responsibilities — I focused on frontend and database logic while my partner upskilled in Supabase and vendor side, and we frequently synced our progress.

- UPI Integration for Multiple Vendors:
Handling payments where each vendor has a unique UPI ID was tricky. We resolved this by dynamically mapping each order to the correct UPI endpoint using Razorpay’s notes feature and our Supabase schema.

- Real-time Updates & Order Management:
Ensuring that vendors could track incoming orders live required learning about real-time subscriptions in Supabase. After testing different approaches, we implemented real-time database triggers to reflect order changes instantly in the dashboard.

- UI/UX Optimization for Students:
Since we built the app for a campus environment, we had to ensure the app was lightweight, intuitive, and mobile-first. We iterated on the design based on peer feedback and focused on reducing taps to complete key actions.
