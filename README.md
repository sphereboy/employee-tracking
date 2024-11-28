# Employee Tracking Application

A modern web application built with Next.js 14 for tracking and managing employees across different locations and time zones.

## 🌟 Features

- **Real-time Employee Management**: Track employees across different time zones and locations
- **Dynamic Time Zone Handling**: Automatically displays local times and availability status
- **Drag-and-Drop Interface**: Intuitive organization of employee cards
- **Company Management**: Support for multiple companies and departments
- **Modern Authentication**: Secure user authentication with NextAuth.js
- **Responsive Design**: Beautiful UI that works across all devices

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authentication**: NextAuth.js
- **Database**: MongoDB with MongoDB Atlas
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI with shadcn/ui
- **State Management**: React Hooks
- **Drag & Drop**: dnd-kit
- **Date/Time**: date-fns & date-fns-tz

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/employee-tracking.git
   cd employee-tracking
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then, update `.env.local` with your values:

   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

src/
├── app/ # Next.js App Router pages
├── components/ # React components
├── lib/ # Utility functions and configurations
├── types/ # TypeScript type definitions
└── utils/ # Helper functions

## 🔒 Authentication

The application uses NextAuth.js for authentication with the following features:

- Email authentication
- Protected API routes
- Role-based access control (Admin, Member, Employee)
- Persistent sessions with MongoDB

## 💾 Database Schema

The application uses MongoDB with the following main collections:

- `users`: User accounts and authentication
- `accounts`: Company accounts and settings
- `employees`: Employee information and relationships

## 🛠️ Development

To contribute to the project:

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git commit -m "Add your feature description"
   ```

3. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Bug Reports

If you find a bug, please create an issue with:

1. Bug description
2. Steps to reproduce
3. Expected behavior
4. Screenshots (if applicable)

## 📧 Contact

For any questions or support, please contact [rob@1oakstudios.com](mailto:rob@1oakstudios.com)
