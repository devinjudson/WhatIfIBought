# What If I Bought

A web application that lets you explore "what if" scenarios for stock investments. See how your investment would have performed if you had bought a particular stock on a specific date.

## Features

- Search for stocks and view their historical performance
- Calculate potential returns on hypothetical investments
- Get AI-generated investment analysis summaries
- View historical price charts
- Works with mock data out of the box, or real data with API keys

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/yourusername/whatifibought.git
cd whatifibought
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Mock Data vs. Real Data

The application works in two modes:

### Mock Data Mode (Default)

- Works immediately without any API keys
- Generates realistic-looking stock data
- Provides simulated investment analysis
- Perfect for testing and development

### Real Data Mode

To use real data, you'll need to:

1. Get API keys:

   - [OpenAI API Key](https://platform.openai.com/api-keys) for investment analysis
   - [Financial Modeling Prep API Key](https://site.financialmodelingprep.com/developer/docs/) for stock data

2. Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=your_openai_api_key_here
FMP_API_KEY=your_fmp_api_key_here
```

3. Restart the development server

## Technology Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- OpenAI API
- Financial Modeling Prep API
- React
- Shadcn/ui Components

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
